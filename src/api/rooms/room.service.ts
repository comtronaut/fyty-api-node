import { BadRequestException, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Room, RoomStatus } from "@prisma/client";
import dayjs from "dayjs";
import { CreateRoomDto, UpdateRoomDto } from "src/model/dto/room/room.dto";
import { PrismaService } from "src/services/prisma.service";

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
          data: { isDel: true }
        })
      ]);
    } catch (err) {
      console.error(err.message);
    }
  }

  // CRUD
  async create({ teamlineUpIds, ...data }: CreateRoomDto) {
    try {
      const room = await this.prisma.room.create({ data });
      const board = await this.prisma.roomLineupBoard.create({ data: {} });

      const lineUps = teamlineUpIds?.split(",") ?? [];

      await this.prisma.roomLineup.createMany({
        data: lineUps.map((teamLineUpId) => ({
          roomLineUpBoardId: board.id,
          teamLineUpId
        }))
      });

      const participantData = {
        roomId: room.id,
        teamId: data.hostId,
        gameId: data.gameId,
        roomLineUpBoardId: board.id
      };

      await Promise.all([
        this.prisma.roomParticipant.create({ data: participantData }),
        this.prisma.chat.create({ data: { roomId: room.id } })
      ]);

      return {
        room
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(roomId: string, req: UpdateRoomDto) {
    try {
      const updateRes = await this.prisma.room.update({
        where: {
          id: roomId
        },
        data: req
      });

      return {
        room: await this.prisma.room.findUniqueOrThrow({
          where: { id: roomId }
        })
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getJoinedRoom(teamId: string) {
    // new
    try {
      const participants = await this.prisma.roomParticipant.findMany({
        where: { teamId }
      });
      const joined = await this.prisma.room.findMany({
        where: { id: { in: participants.map((e) => e.roomId) } }
      });

      const request = await this.prisma.roomRequest.findMany({
        where: { teamId }
      });
      const requested = await this.prisma.room.findMany({
        where: { id: { in: request.map((e) => e.roomId) } }
      });

      return {
        joined,
        requested
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomsByGameId(gameId: string) {
    try {
      return this.prisma.room.findMany({ where: { gameId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomsById(roomId: string) {
    try {
      return await this.prisma.room.findMany({ where: { id: roomId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomByHostId(teamId: string) {
    try {
      return await this.prisma.room.findMany({ where: { hostId: teamId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomsByDate(date: string, gameId: string) {
    // date format is yyyy-mm-dd just like 2020-5-27 and we need output that at input day
    try {
      const today = new Date(date);

      const dayStart = dayjs(today).startOf("day").toDate();
      const dayEnd = dayjs(today).endOf("day").toDate();

      return await this.prisma.room.findMany({
        where: {
          startAt: {
            gte: dayStart,
            lte: dayEnd
          },
          gameId
        }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAllRooms(gameId: string, roomName?: string, date?: any) {
    try {
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
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async disband(payload: any) {
    try {
      const teamId = payload.teamId;
      const room = await this.prisma.room.findUniqueOrThrow({
        where: { id: payload.roomId }
      });

      if (room.hostId === teamId) {
        await this.prisma.appointment.updateMany({
          where: { roomId: room.id },
          data: { isDel: true }
        });

        await this.prisma.room.delete({ where: { id: room.id } });

        return {
          roomId: room.id
        };
      }
      throw new Error("Only host can disband the room");
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async joinRoom(teamId: string, roomId: string) {
    try {
      const timestamp = new Date();

      const room = await this.prisma.room.findUniqueOrThrow({
        where: { id: roomId }
      });
      const game = await this.prisma.game.findUniqueOrThrow({
        where: { id: room.gameId }
      });

      if (timestamp <= room.endAt) {
        // check is room available
        if (
          room.status === RoomStatus.UNAVAILABLE
          || room.status === RoomStatus.FULL
        ) {
          throw new Error("room is not available");
        }

        // update room status
        await this.updateStatus(room);

        // find room request
        const request = await this.prisma.roomRequest.findFirstOrThrow({
          where: { teamId, roomId }
        });

        // add participant to the room
        const participantData = {
          roomId: room.id,
          teamId,
          gameId: game.id,
          roomLineUpBoardId: request.roomLineUpBoardId
        };
        const participant = await this.prisma.roomParticipant.create({
          data: participantData
        });

        // add appointment
        const appointmentData = {
          startAt: room.startAt,
          endAt: room.endAt,
          roomId: room.id,
          status: "WAITING",
          isDel: false
        };
        const appointment = await this.prisma.appointment.create({
          data: appointmentData
        });

        await this.prisma.appointmentMember.createMany({
          data: [
            { teamId, appointId: appointment.id }, // for guest
            { teamId: room.hostId, appointId: appointment.id } // for host
          ]
        });

        return {
          roomParticipant: participant
        };
      } else {
        throw new BadRequestException("this room has expired");
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateStatus(room: Room) {
    await this.prisma.room.update({
      where: {
        id: room.id
      },
      data: {
        ...room,
        status: RoomStatus.UNAVAILABLE,
        teamCount: {
          increment: 1
        }
      }
    });
  }

  async leaveRoom(participantId: string) {
    try {
      const parti = await this.prisma.roomParticipant.findUniqueOrThrow({
        where: { id: participantId }
      });
      const room = await this.prisma.room.findUniqueOrThrow({
        where: { id: parti.roomId }
      });

      await this.prisma.room.update({
        where: { id: room.id },
        data: {
          ...room,
          // update participant count
          teamCount: {
            decrement: 1
          },
          // update room status
          status: RoomStatus.AVAILABLE
        }
      });

      // remove appointment
      await this.prisma.appointment.deleteMany({ where: { roomId: room.id } });

      // remove participant from the room
      await this.prisma.roomParticipant.delete({
        where: { id: participantId }
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
}
