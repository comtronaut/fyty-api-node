import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { Appointment, PendingStatus, Room, RoomLineup, RoomMember } from "@prisma/client";
import { compact } from "lodash";

import { getDayRangeWithin } from "common/utils/date";
import { diffMinute } from "common/utils/time";
import { CreateRoomMemberDto } from "model/dto/room-member.dto";
import { CreateRoomDto, DeleteRoomDto, UpdateRoomDto } from "model/dto/room.dto";
import { ImageService } from "modules/image/image.service";
import { PrismaService } from "prisma/prisma.service";

import { LineNotifyService } from "../notification/line-notify.service";

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lineNotify: LineNotifyService,
    private readonly imageService: ImageService
  ) {}

  async create({
    teamLineupIds,
    startAt,
    endAt,
    ...data
  }: CreateRoomDto): Promise<Room & { appointment: Appointment; members: RoomMember[] }> {
    const { room, ...appointment } = await this.prisma.appointment.create({
      data: {
        startAt,
        endAt,
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
      include: {
        room: {
          include: {
            members: true
          }
        }
      }
    });

    if (!room) {
      throw new InternalServerErrorException("room is missing");
    }

    await this.createUserNotifRegistrationsFromTeamIds(room.id, [ data.hostTeamId ]);

    return { ...room, appointment };
  }

  async createUserNotifRegistrationsFromTeamIds(
    roomId: string,
    teamIds: string[]
  ): Promise<void> {
    const teamMembers = await this.prisma.teamMember.findMany({
      where: {
        team: {
          id: { in: teamIds }
        }
      },
      select: {
        userId: true
      }
    });

    const userIds = teamMembers.map((e) => e.userId);

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
    return await this.prisma.roomMember.findMany({
      where: { roomId }
    });
  }

  async getRoomLineupsByRoomId(roomId: string): Promise<RoomLineup[]> {
    return await this.prisma.roomLineup.findMany({
      where: {
        roomMember: { roomId }
      }
    });
  }

  async getById(roomId: string): Promise<Room> {
    return await this.prisma.room.findUniqueOrThrow({ where: { id: roomId } });
  }

  async getByTeamFilter(
    teamId: string,
    cluase: Partial<{ isJoined: boolean; isPending: boolean; isHosted: boolean }>
  ): Promise<Partial<{ joined: Room[]; requested: Room[]; hosted: Room[] }>> {
    const [ joined, requested, hosted ] = await Promise.all([
      cluase.isJoined
        ? this.prisma.room.findMany({
          where: {
            members: { some: { teamId } }
          }
        })
        : [],
      cluase.isPending
        ? this.prisma.room.findMany({
          where: {
            pendings: {
              some: {
                teamId,
                status: PendingStatus.INCOMING
              }
            }
          }
        })
        : [],
      cluase.isHosted
        ? this.prisma.room.findMany({
          where: {
            hostTeamId: teamId
          }
        })
        : []
    ]);

    return {
      ...(cluase.isJoined && { joined }),
      ...(cluase.isPending && { requested }),
      ...(cluase.isHosted && { hosted })
    };
  }

  async getByFilter(
    clause: Partial<{ gameId: string; name: string; date: string }>
  ): Promise<Room[]> {
    const { start, end } = getDayRangeWithin(clause.date ?? new Date());

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
      room: { appointment, members, ...room },
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
            members: true,
            appointment: true
          }
        }
      }
    });
    const isRoomUnavailable = members.length >= game.teamCap;

    if (isRoomUnavailable) {
      throw new ConflictException("room is not available");
    }
    if (new Date() > appointment.endAt) {
      throw new BadRequestException("this room has expired");
    }

    await this.prisma.room.update({
      where: {
        id: roomId
      },
      data: {
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
        }
      },
      include: {
        room: {
          include: {
            members: true,
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
    if (room.members.length <= 0) {
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

  async getRoomDetailById(roomId: string) {
    return await this.prisma.room.findUniqueOrThrow({
      where: { id: roomId },
      include: {
        members: {
          include: {
            team: true,
            lineups: {
              include: {
                teamLineup: true
              }
            }
          }
        },
        settings: true,
        appointment: true,
        pendings: true
      }
    });
  }
}
