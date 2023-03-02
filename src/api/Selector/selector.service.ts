import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class SelectorService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(me: User) {
    try {
      const myTeams = await this.prisma.team.findMany({
        where: { ownerId: me.id }
      });
      return {
        user: me,
        teams: myTeams
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getChat(roomId: string) {
    try {
      const chat = await this.prisma.chat.findFirstOrThrow({
        where: { roomId }
      });
      const message = await this.prisma.message.findMany({
        where: { chatId: chat.id }
      });
      return {
        chat,
        messages: message
      };
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
