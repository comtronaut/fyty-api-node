import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { PendingStatus, Room, RoomLineup, RoomMember, RoomStatus } from "@prisma/client";
import { compact } from "lodash";

import { getDayRangeWithin } from "common/utils/date";
import { diffMinute } from "common/utils/time";
import { CreateRoomMemberDto } from "model/dto/room-member.dto";
import { CreateRoomDto, DeleteRoomDto, UpdateRoomDto } from "model/dto/room.dto";
import { ImageService } from "modules/image/image.service";
import { PrismaService } from "prisma/prisma.service";

import { NotifyService } from "../notification/line-notify.service";

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lineNotify: NotifyService,
    private readonly imageService: ImageService
  ) {}

  async create({ teamLineupIds, ...data }: CreateRoomDto): Promise<Room> {
    const { room } = await this.prisma.appointment.create({
      data: {
        startAt: data.startAt,
        endAt: data.endAt,
        members: {
          create: {
            teamId: data.hostTeamId
          }
        },
        room: {
          create: {
            ...data,
            members: {
              create: {
                teamId: data.hostTeamId,
                lineups: {
                  createMany: {
                    data: teamLineupIds.map((id) => ({
                      teamLineupId: id
                    }))
                  }
                }
              }
            },
            settings: {
              create: {}
            },
            chat: {
              create: {}
            }
          }
        }
      },
      include: { room: true }
    });

    if (!room) {
      throw new InternalServerErrorException("room is missing");
    }

    await this.createUserNotifRegistrationsFromTeamIds(room.id, [ data.hostTeamId ]);

    return room;
  }

  async createUserNotifRegistrationsFromTeamIds(
    roomId: string,
    teamIds: string[]
  ): Promise<void> {
    const teams = await this.prisma.team.findMany({
      where: {
        id: { in: teamIds }
      },
      select: {
        members: {
          select: {
            userId: true
          }
        }
      }
    });

    const userIds = teams.flatMap((e) => e.members.map((e) => e.userId));

    await this.prisma.notifUserRoomRegistration.createMany({
      data: userIds.map((userId) => ({
        userId,
        roomId
      }))
    });
  }

  async update(roomId: string, data: UpdateRoomDto): Promise<Room> {
    const updatedRoom = await this.prisma.room.update({
      where: {
        id: roomId
      },
      data: {
        ...data
      }
    });

    if (data.endAt || data.startAt) {
      await this.prisma.appointment.update({
        where: { id: updatedRoom.appointmentId },
        data: {
          ...(data.startAt && { startAt: data.startAt }),
          ...(data.endAt && { endAt: data.endAt })
        }
      });
    }

    return updatedRoom;
  }

  async getRoomMembersByRoomId(roomId: string): Promise<RoomMember[]> {
    const { members } = await this.prisma.room.findFirstOrThrow({
      where: { id: roomId },
      select: { members: true }
    });
    return members;
  }

  async getRoomLineupsByRoomId(roomId: string): Promise<RoomLineup[]> {
    const { members } = await this.prisma.room.findFirstOrThrow({
      where: { id: roomId },
      select: {
        members: {
          select: {
            lineups: true
          }
        }
      }
    });

    return members.flatMap((m) => m.lineups);
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
      select: {
        id: true,
        appointmentId: true,
        hostTeamId: true,
        chat: {
          select: {
            messages: {
              select: {
                imageUrls: true
              }
            }
          }
        }
      }
    });

    if (room.hostTeamId === payload.teamId) {
      const { members, ...appointment } = await this.prisma.appointment.update({
        where: { id: room.appointmentId },
        data: {
          isDeleted: true,
          room: {
            delete: true
          }
        },
        include: {
          members: true
        }
      });

      const currentMembers = members.filter((e) => !e.isLeft);
      await this.prisma.appointmentMember.updateMany({
        where: {
          id: {
            in: currentMembers.map((e) => e.id)
          }
        },
        data: {
          isLeft: true
        }
      });

      // if is in training period
      const currentTime = new Date().getTime();
      const startTime = appointment.startAt.getTime();
      const endTime = appointment.endAt.getTime();
      if (currentTime > startTime && currentTime < endTime) {
        await this.prisma.teamStats.updateMany({
          where: {
            teamId: {
              in: currentMembers.map((e) => e.teamId)
            }
          },
          data: {
            trainingMinute: {
              increment: diffMinute(startTime, currentTime)
            },
            leftWhileTrainingCount: {
              increment: 1
            },
            trainingCount: {
              increment: 1
            }
          }
        });
      }

      // delete images
      const imageIds
        = room.chat?.messages
          .flatMap((e) => e.imageUrls)
          .map((e) => this.imageService.extractCuidFromUrl(e)) ?? [];

      await this.imageService.deleteImageByIds(compact(imageIds));

      // send notification
      void this.lineNotify.searchUserForDisbanRoomNotify(payload.roomId);

      return {
        roomId: room.id
      };
    }

    throw new Error("only host can disband the room");
  }

  async acceptRoomRequest({ roomId, teamId }: CreateRoomMemberDto) {
    const {
      team: { game },
      room: { appointment, ...room },
      lineups,
      ...pending
    } = await this.prisma.roomPending.findUniqueOrThrow({
      where: {
        teamId_roomId: {
          teamId,
          roomId
        }
      },
      select: {
        id: true,
        lineups: {
          select: { teamLineupId: true }
        },
        team: {
          select: { game: true }
        },
        room: {
          include: {
            appointment: {
              select: { id: true }
            }
          }
        }
      }
    });

    if (
      [ RoomStatus.UNAVAILABLE, RoomStatus.FULL ].some((status) => status === room.status)
    ) {
      throw new ConflictException("room is not available");
    }
    if (new Date() > room.endAt) {
      throw new BadRequestException("this room has expired");
    }

    await this.prisma.room.update({
      where: {
        id: roomId
      },
      data: {
        ...(room.teamCount >= game.teamCap - 1 && { status: RoomStatus.UNAVAILABLE }),
        teamCount: {
          increment: 1
        },
        // add room member and lineups
        members: {
          create: {
            teamId,
            lineups: {
              createMany: {
                data: lineups.map(({ teamLineupId }) => ({
                  roomId,
                  teamLineupId
                }))
              }
            }
          }
        },
        // delete the request
        pendings: {
          delete: pending
        }
      }
    });

    // notify accept room
    void this.lineNotify.searchUserForAcceptNotify(roomId, teamId);

    // upsert appointment
    if (appointment) {
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
        lineups: {
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
    if (room.appointment) {
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
        where: { id: room.appointmentId },
        data: {
          isDeleted: true
        }
      });
    }

    // update team's stats
    const currentTime = new Date().getTime();
    const startTime = room.appointment?.startAt.getTime() ?? NaN;
    const endTime = room.appointment?.endAt.getTime() ?? NaN;
    if (currentTime > startTime && currentTime < endTime) {
      await this.prisma.teamStats.update({
        where: {
          teamId: leavingMember.teamId
        },
        data: {
          trainingMinute: {
            increment: diffMinute(startTime, currentTime)
          },
          leftWhileTrainingCount: {
            increment: 1
          },
          trainingCount: {
            increment: 1
          }
        }
      });
    }

    // notify leaving room
    void this.lineNotify.searchUserForLeaveNotify(roomMemberId, room.id);

    return {
      res: {
        roomParticipant: leavingMember
      },
      roomId: room.id
    };
  }

  async deleteMultiple(
    roomIds: string[],
    isDeletedBefore = false,
    isMemberStatusPreserved = false
  ) {
    await Promise.all(
      roomIds.map((id) => this.deleteSingle(id, isDeletedBefore, isMemberStatusPreserved))
    );
  }

  async deleteSingle(
    roomId: string,
    isDeletedBefore = false,
    isMemberStatusPreserved = false
  ) {
    const { appointmentId } = await this.prisma.room.findUniqueOrThrow({
      where: { id: roomId },
      select: { appointmentId: true }
    });

    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        isDeleted: true,
        ...(isDeletedBefore && { deletedBeforeAt: new Date() }),
        room: {
          delete: true
        },
        ...(!isMemberStatusPreserved && {
          members: {
            updateMany: {
              where: {},
              data: { isLeft: true }
            }
          }
        })
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
