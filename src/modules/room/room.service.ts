import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PendingStatus, Room, RoomLineup, RoomMember, RoomStatus } from "@prisma/client";
import dayjs from "dayjs";
import { CreateRoomMemberDto } from "src/model/dto/room-member.dto";
import { CreateRoomDto, DeleteRoomDto, UpdateRoomDto } from "src/model/dto/room.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE, { timeZone: "Asia/Bangkok" })
  async handleCron() {
    try {
      const timestamp = dayjs().add(30, "second").toDate();

      const rooms = await this.prisma.room.findMany({
        where: {
          endAt: {
            lte: timestamp
          }
        },
        select: {
          id: true
        }
      });

      if (!rooms.length) {
        return;
      }

      await this.deleteMultiple(
        timestamp,
        rooms.map((room) => room.id)
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }

  async create({ teamLineupIds, ...data }: CreateRoomDto) {
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
        }
      },
      include: {
        members: true
      }
    });

    await this.prisma.roomLineup.createMany({
      data: teamLineupIds.map((teamLineupId) => ({
        teamLineupId,
        roomMemberId: member.id,
        roomId: room.id
      }))
    });

    // create room appointment
    await this.prisma.appointment.create({
      data: {
        startAt: data.startAt,
        endAt: data.endAt,
        roomId: room.id,
        members: {
          create: {
            teamId: data.hostTeamId
          }
        }
      }
    });

    return {
      room
    };
  }

  async update(roomId: string, data: UpdateRoomDto) {
    return await this.prisma.room.update({
      where: {
        id: roomId
      },
      data
    });
  }

  async getJoinedAndPendingRoomsByTeamId(teamId: string) {
    try {
      const [ participants, request ] = await Promise.all([
        this.prisma.roomMember.findMany({
          where: { teamId },
          select: { room: true }
        }),
        this.prisma.roomPending.findMany({
          where: { teamId, status: PendingStatus.INCOMING },
          select: { room: true }
        })
      ]);

      const joined = participants.map((e) => e.room);
      const requested = request.map((e) => e.room);

      return {
        joined,
        requested
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
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

  async getByHostTeamId(teamId: string): Promise<Room[]> {
    return await this.prisma.room.findMany({ where: { hostTeamId: teamId } });
  }

  async getAll(gameId?: string, roomName?: string, date?: any): Promise<Room[]> {
    const today = new Date(date);

    const dayStart = dayjs(today).startOf("day").toDate();
    const dayEnd = dayjs(today).endOf("day").toDate();

    return await this.prisma.room.findMany({
      where: {
        ...(gameId && { gameId }),
        ...(roomName && { name: roomName }),
        ...(date && { startAt: { gte: dayStart, lte: dayEnd } })
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
    if ([ RoomStatus.UNAVAILABLE, RoomStatus.FULL ].some((status) => status === room.status)) {
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

    // if host leave, set new host
    if (room.hostTeamId === leavingMember.teamId && room.teamCount > 1) {
      const { id: hostTeamId } = await this.prisma.roomMember.findFirstOrThrow({
        where: {
          roomId: room.id
        },
        select: { id: true }
      });
      
      await this.prisma.room.update({
        where: { id: room.id },
        data: {
          hostTeamId
        }
      });
    }

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

  async deleteMultiple(timestamp: Date, roomIds: string[]) {
    await Promise.all([
      this.prisma.room.deleteMany({
        where: {
          endAt: {
            lte: timestamp
          }
        }
      }),
      this.prisma.appointment.updateMany({
        where: {
          roomId: {
            in: roomIds
          }
        },
        data: {
          isDeleted: true
        }
      })
    ]);
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
