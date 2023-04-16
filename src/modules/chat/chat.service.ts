import { Prisma } from ".prisma/client";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ChatCreateInput) {
    return await this.prisma.chat.create({ data });
  }

  async getChatWithMessages(chatId: string) {
    return await this.prisma.chat.findFirstOrThrow({
      where: { id: chatId },
      include: { messages: true }
    });
  }

  async getChatWithMessagesByRoomId(roomId: string) {
    return await this.prisma.chat.findFirstOrThrow({
      where: { roomId },
      include: { messages: true }
    });
  }
}
