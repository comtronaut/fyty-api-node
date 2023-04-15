import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CreateParticipantDto } from "src/model/dto/room-member.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RoomParticipantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(req: Prisma.RoomParticipantCreateInput) {
    try {
      return await this.prisma.roomParticipant.create({ data: req });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getParticipantByRoomId(roomId: string) {
    return this.prisma.roomParticipant.findMany({ where: { roomId } });
  }

  async countTeamGame(teamId: string, gameId: string) {
    try {
      return await this.prisma.roomParticipant.count({
        where: { teamId, gameId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(req: CreateParticipantDto) {
    try {
      return await this.prisma.roomParticipant.deleteMany({
        where: { teamId: req.teamId, roomId: req.roomId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
