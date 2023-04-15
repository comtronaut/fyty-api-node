import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoomDto, UpdateRoomDto } from "src/model/dto/room.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminRoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRooms() {
    try {
      return await this.prisma.room.findMany();
    } catch (err) {
      throw new BadRequestException(err.message);
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

  async getRoom(roomId: string) {
    try {
      return await this.prisma.room.findUniqueOrThrow({
        where: {
          id: roomId
        }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomParticipants(roomId: string) {
    try {
      return await this.prisma.roomParticipant.findMany({
        where: {
          roomId
        }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoomLineUp(roomId: string) {
    try {
      const roomParticipant = await this.prisma.roomParticipant.findMany({
        where: {
          roomId
        }
      });

      return await this.prisma.roomLineup.findMany({
        where: {
          roomLineUpBoardId: {
            in: roomParticipant.flatMap((e) =>
              e.roomLineUpBoardId ? [ e.roomLineUpBoardId ] : []
            )
          }
        }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(roomId: string, req: UpdateRoomDto) {
    try {
      return await this.prisma.room.update({
        where: {
          id: roomId
        },
        data: req
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(roomId: string) {
    try {
      return await this.prisma.room.delete({ where: { id: roomId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
