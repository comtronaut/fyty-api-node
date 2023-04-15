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
      return await this.prisma.roomMember.findMany({
        where: {
          roomId
        }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getLineupsByRoomId(roomId: string) {
    try {
      const roomParticipant = await this.prisma.roomMember.findFirst({
        where: {
          roomId
        },
        select: {
          roomLineups: true
        }
      });

      return roomParticipant?.roomLineups ?? [];
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
