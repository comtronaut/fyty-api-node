import {
  BadRequestException,
  ConflictException,
  Injectable,
  MessageEvent,
  Sse
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PendingStatus, Room, RoomLineup, RoomMember, RoomStatus } from "@prisma/client";
import dayjs from "dayjs";
import { Observable, Subject, map } from "rxjs";
import { EventSourceKey } from "src/common/constants/keys";
import { getDayRangeWithin } from "src/common/utils/date";
import { CreateRoomMemberDto } from "src/model/dto/room-member.dto";
import { CreateRoomDto, DeleteRoomDto, UpdateRoomDto } from "src/model/dto/room.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomSystemRemoval } from "src/types/sse-payload";

@Injectable()
export class RoomService {
  private readonly roomSystemRemoval = new Subject<RoomSystemRemoval>();

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: "Asia/Bangkok" })
  async handleCron() {
    try {
      const timestamp = dayjs().add(5, "second").toDate();

      const rooms = await this.prisma.room.findMany({
        where: {
          endAt: {
            lte: timestamp
          }
        },
        select: {
          id: true,
          hostTeamId: true,
          startAt: true,
          endAt: true,
          game: {
            select: {
              teamCap: true
            }
          },
          members: {
            select: {
              teamId: true
            }
          },
          appointment: {
            select: {
              id: true
            }
          }
        }
      });

      if (!rooms.length) {
        return;
      }

      // update team stats
      void Promise.all(
        rooms.map(({ startAt, endAt, members }) => {
          const trainingMinute = Math.abs(dayjs(startAt).diff(dayjs(endAt), "minute"));
          const teamIds = members.map((e) => e.teamId);

          return this.prisma.teamStats.updateMany({
            where: { teamId: { in: teamIds } },
            data: {
              trainingMinute: {
                increment: trainingMinute
              },
              trainingCount: {
                increment: 1
              }
            }
          });
        })
      );

      await Promise.all([
        // create training result
        this.prisma.training.createMany({
          data: rooms
            .filter((e) =>
              [
                e.appointment,
                e.members.length === e.game.teamCap,
                e.members.filter((f) => f.teamId !== e.hostTeamId).length
              ].every(Boolean)
            )
            .map((e) => ({
              appointmentId: e.appointment!.id,
              hostId: e.hostTeamId,
              guestId: e.members.filter((f) => f.teamId !== e.hostTeamId)[0]!.teamId
            }))
        }),
        // delete rooms
        this.deleteMultiple(rooms.map((room) => room.id))
      ]);

      // send notifications
      for (const room of rooms) {
        this.roomSystemRemoval.next({
          roomId: room.id,
          appointmentId: room.appointment!.id,
          isDone:
            room.members.length > 1
            && Boolean(room.members.filter((f) => f.teamId !== room.hostTeamId)[0])
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }

  @Sse(EventSourceKey.RoomSystemRemoval)
  sse(): Observable<MessageEvent> {
    return this.roomSystemRemoval.pipe(map((data) => ({ data })));
  }

  async create({ teamLineupIds, ...data }: CreateRoomDto): Promise<Room> {
    const {
      members: [ member ],
      ...room
    } = await this.prisma.room.create({
      data: {
        ...data,
        members: {
          create: {
            teamId: data.hostTeamId
          }
        },
        settings: {
          create: {}
        },
        chat: {
          create: {}
        },
        // create room appointment
        appointment: {
          create: {
            startAt: data.startAt,
            endAt: data.endAt,
            members: {
              create: {
                teamId: data.hostTeamId
              }
            }
          }
        }
      },
      include: { members: true }
    });

    await this.prisma.roomLineup.createMany({
      data: teamLineupIds.map((teamLineupId) => ({
        teamLineupId,
        roomMemberId: member.id,
        roomId: room.id
      }))
    });

    return room;
  }

  async update(roomId: string, data: UpdateRoomDto): Promise<Room> {
    return await this.prisma.room.update({
      where: {
        id: roomId
      },
      data: {
        ...data,
        ...((data.endAt || data.startAt) && {
          appointment: {
            update: {
              startAt: data.startAt,
              endAt: data.endAt
            }
          }
        })
      }
    });
  }

  async getRoomMembersByRoomId(roomId: string): Promise<RoomMember[]> {
    const { members } = await this.prisma.room.findFirstOrThrow({
      where: { id: roomId },
      select: { members: true }
    });
    return members;
  }

  async getRoomLineupsByRoomId(roomId: string): Promise<RoomLineup[]> {
    const { lineups } = await this.prisma.room.findFirstOrThrow({
      where: { id: roomId },
      select: { lineups: true }
    });
    return lineups;
  }

  async getById(roomId: string): Promise<Room> {
    return await this.prisma.room.findUniqueOrThrow({ where: { id: roomId } });
  }

  async getByTeamFilter(
    teamId: string,
    cluase: Partial<{ isJoined: boolean; isPending: boolean; isHosted: boolean }>
  ): Promise<Partial<{ joined: Room[]; requested: Room[]; hosted: Room[] }>> {
    const [ participants, request, hosted ] = await Promise.all([
      cluase.isJoined
        ? this.prisma.roomMember.findMany({
          where: { teamId },
          select: { room: true }
        })
        : [],
      cluase.isPending
        ? this.prisma.roomPending.findMany({
          where: { teamId, status: PendingStatus.INCOMING },
          select: { room: true }
        })
        : [],
      cluase.isHosted ? this.prisma.room.findMany({ where: { hostTeamId: teamId } }) : []
    ]);

    const joined = participants.map((e) => e.room);
    const requested = request.map((e) => e.room);

    return {
      ...(cluase.isJoined && { joined }),
      ...(cluase.isPending && { requested }),
      ...(cluase.isHosted && { hosted })
    };
  }

  async getByFilter(
    clause: Partial<{ gameId: string; name: string; date: string }>
  ): Promise<Room[]> {
    const { start, end } = getDayRangeWithin(clause.date);

    return await this.prisma.room.findMany({
      where: {
        ...(clause.gameId && { gameId: clause.gameId }),
        ...(clause.name && { name: clause.name }),
        ...(clause.date && { startAt: { gte: start, lte: end } })
      }
    });
  }

  async disband(payload: DeleteRoomDto) {
    const room = await this.prisma.room.findUniqueOrThrow({
      where: { id: payload.roomId },
      select: { id: true, hostTeamId: true }
    });

    if (room.hostTeamId === payload.teamId) {
      await this.prisma.appointment.update({
        where: { roomId: room.id },
        data: {
          isDeleted: true,
          room: {
            delete: true
          }
        }
      });

      return {
        roomId: room.id
      };
    }

    throw new Error("only host can disband the room");
  }

  async acceptRoomRequest({ roomId, teamId }: CreateRoomMemberDto) {
    const { appointment, ...room } = await this.prisma.room.findUniqueOrThrow({
      where: { id: roomId },
      include: { appointment: true }
    });
    const { lineups, ...pending } = await this.prisma.roomPending.findUniqueOrThrow({
      where: {
        teamId_roomId: {
          teamId,
          roomId
        }
      },
      select: { id: true, lineups: true }
    });
    const { game } = await this.prisma.team.findUniqueOrThrow({
      where: { id: teamId },
      include: { game: true }
    });

    if (room.hostTeamId !== teamId) {
      throw new Error("only host can accept the room request");
    }
    if (
      [ RoomStatus.UNAVAILABLE, RoomStatus.FULL ].some((status) => status === room.status)
    ) {
      throw new ConflictException("room is not available");
    }
    if (new Date() > room.endAt) {
      throw new BadRequestException("this room has expired");
    }

    // create joining data
    const newRoomMember = await this.prisma.roomMember.create({
      data: {
        roomId,
        teamId
      }
    });

    await this.prisma.room.update({
      where: {
        id: room.id
      },
      data: {
        ...room,
        ...(room.teamCount - 1 >= game.teamCap && { status: RoomStatus.UNAVAILABLE }),
        teamCount: {
          increment: 1
        },
        // add room lineups
        lineups: {
          create: lineups.map((teamLineup) => ({
            roomMemberId: newRoomMember.id,
            teamLineupId: teamLineup.id
          }))
        },
        // delete the request
        pendings: {
          delete: pending
        }
      }
    });

    // upsert appointment
    if (appointment?.id) {
      await this.prisma.appointmentMember.upsert({
        where: {
          appointmentId_teamId: {
            appointmentId: appointment.id,
            teamId
          }
        },
        update: {
          isLeft: false
        },
        create: {
          appointmentId: appointment.id,
          teamId
        }
      });
    }

    return {
      teamId,
      roomId
    };
  }

  async leaveRoom(roomMemberId: string) {
    const { room, ...leavingMember } = await this.prisma.roomMember.update({
      where: { id: roomMemberId },
      data: {
        roomLineups: {
          deleteMany: {}
        },
        room: {
          update: {
            // update participant count
            teamCount: {
              decrement: 1
            },
            // update room status
            status: RoomStatus.AVAILABLE
          }
        }
      },
      include: {
        room: {
          include: {
            appointment: true
          }
        }
      }
    });

    // update appointment member
    if (room.appointment?.id) {
      await this.prisma.appointmentMember.update({
        where: {
          appointmentId_teamId: {
            appointmentId: room.appointment.id,
            teamId: leavingMember.teamId
          }
        },
        data: {
          isLeft: true
        }
      });
    }

    // remove member from the room
    await this.prisma.roomMember.delete({
      where: { id: roomMemberId }
    });

    // soft delete appointment if room is empty
    if (room.teamCount <= 0) {
      await this.prisma.appointment.update({
        where: { roomId: room.id },
        data: {
          isDeleted: true
        }
      });
    }

    return {
      res: {
        roomParticipant: leavingMember
      },
      roomId: room.id
    };
  }

  async deleteMultiple(roomIds: string[], isDeletedBefore = false) {
    await Promise.all(roomIds.map((id) => this.deleteSingle(id), isDeletedBefore));
  }

  async deleteSingle(roomId: string, isDeletedBefore = false) {
    await this.prisma.appointment.update({
      where: { roomId },
      data: {
        isDeleted: true,
        ...(isDeletedBefore && { deletedBeforeAt: new Date() }),
        room: {
          delete: true
        },
        members: {
          update: {
            where: {},
            data: { isLeft: true }
          }
        }
      }
    });
  }

  async getRoomDetail(roomId: string) {
    const [ room, participants ] = await Promise.all([
      this.prisma.room.findUniqueOrThrow({ where: { id: roomId } }),
      this.prisma.roomMember.findMany({ where: { roomId } })
    ]);

    const teams = await this.prisma.team.findMany({
      where: { id: { in: participants.map((e) => e.teamId) } }
    });

    return {
      room,
      roomParticipants: participants,
      teams
    };
  }
}
