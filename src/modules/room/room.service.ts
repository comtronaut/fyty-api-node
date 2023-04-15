import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PendingStatus, RoomStatus } from "@prisma/client";
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
        }
      });

      if (!rooms.length) {
        return;
      }

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
              in: rooms.map((room) => room.id)
            }
          },
          data: {
            isDeleted: true
          }
        })
      ]);
    } catch (err) {
      console.error(err.message);
    }
  }

  async create({ teamLineupIds, ...data }: CreateRoomDto) {
    try {
      // create room
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
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(roomId: string, data: UpdateRoomDto) {
    try {
      return await this.prisma.room.update({
        where: {
          id: roomId
        },
        data
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomsByTeamId(teamId: string) {
    try {
      const [ participants, request ] = await Promise.all([
        this.prisma.roomMember.findMany({
          where: { teamId },
          include: { room: true }
        }),
        this.prisma.roomPending.findMany({
          where: { teamId, status: PendingStatus.INCOMING },
          include: { room: true }
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

  async getRoomsByGameId(gameId: string) {
    return this.prisma.room.findMany({ where: { gameId } });
  }

  async getRoomsById(roomId: string) {
    return await this.prisma.room.findMany({ where: { id: roomId } });
  }

  async getRoomByHostId(teamId: string) {
    return await this.prisma.room.findMany({ where: { hostTeamId: teamId } });
  }

  async getAllRooms(gameId: string, roomName?: string, date?: any) {
    const today = new Date(date);

    const dayStart = dayjs(today).startOf("day").toDate();
    const dayEnd = dayjs(today).endOf("day").toDate();

    return await this.prisma.room.findMany({
      where: {
        ...(roomName && { name: roomName }),
        ...(date && { startAt: { gte: dayStart, lte: dayEnd } }),
        gameId
      }
    });
  }

  async disband(payload: DeleteRoomDto) {
    const teamId = payload.teamId;
    const room = await this.prisma.room.findUniqueOrThrow({
      where: { id: payload.roomId }
    });

    if (room.hostTeamId === teamId) {
      await this.prisma.appointment.updateMany({
        where: { roomId: room.id },
        data: { isDeleted: true }
      });

      await this.prisma.room.delete({ where: { id: room.id } });

      return {
        roomId: room.id
      };
    }

    throw new Error("Only host can disband the room");
  }

  async acceptRoomRequest({ roomId, teamId }: CreateRoomMemberDto) {
    const { appointment, ...room } = await this.prisma.room.findUniqueOrThrow({
      where: { id: roomId },
      include: { appointment: true }
    });
    const { lineups, ...pendings } = await this.prisma.roomPending.findFirstOrThrow({
      where: { teamId, roomId },
      include: { lineups: true }
    });

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
        status: RoomStatus.UNAVAILABLE,
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
        // add to appointment
        appointment: {
          update: {
            id: appointment?.id,
            members: {
              create: {
                teamId
              }
            }
          }
        },
        // delete the request
        pendings: {
          delete: {
            id: pendings.id
          }
        }
      }
    });

    return {
      teamId,
      roomId
    };
  }

  async leaveRoom(roomMemberId: string) {
    try {
      const { room, ...parti } = await this.prisma.roomMember.update({
        where: { id: roomMemberId },
        data: {
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
          room: true
        }
      });

      // remove appointment
      if (room.teamCount === 0) {
        await this.prisma.appointment.update({
          where: { roomId: room.id },
          data: {
            isDeleted: true
          }
        });
      }

      // remove participant from the room
      await this.prisma.roomMember.delete({
        where: { id: roomMemberId }
      });

      return {
        res: {
          roomParticipant: parti
        },
        roomId: room.id
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomDetail(roomId: string) {
    try {
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
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
