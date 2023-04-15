import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SelectorService {
  constructor(private readonly prisma: PrismaService) {}

  async getChat(roomId: string) {
    try {
      return await this.prisma.chat.findFirstOrThrow({
        where: { roomId },
        include: { messages: true }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getRoom(roomId: string) {
    // not sure for map without await
    try {
      const [ room, participants ] = await Promise.all([
        this.prisma.room.findUniqueOrThrow({ where: { id: roomId } }),
        this.prisma.roomParticipant.findMany({ where: { roomId } })
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
