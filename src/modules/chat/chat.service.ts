import { Injectable } from "@nestjs/common";
import { Chat, Message, Prisma } from "@prisma/client";
import { compact, uniq } from "lodash";

import { ChatDetailResponseDto } from "model/dto/chat.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ChatCreateInput) {
    return await this.prisma.chat.create({ data });
  }

  async getChatWithMessages(chatId: string) {
    return await this.prisma.chat.findUniqueOrThrow({
      where: { id: chatId },
      include: { messages: true }
    });
  }

  async getChatDetailByRoomId(roomId: string): Promise<ChatDetailResponseDto> {
    const { messages, ...chat } = await this.prisma.chat.findUniqueOrThrow({
      where: { roomId },
      include: { messages: true }
    });

    return await this.extractChatDetail(chat, messages);
  }

  async getChatDetailById(chatId: string): Promise<ChatDetailResponseDto> {
    const { messages, ...chat } = await this.prisma.chat.findUniqueOrThrow({
      where: { id: chatId },
      include: { messages: true }
    });

    return await this.extractChatDetail(chat, messages);
  }

  async extractChatDetail(chat: Chat, messages: Message[]): Promise<ChatDetailResponseDto> {
    const chatTeamIds = uniq(compact(messages.map((e) => e.teamId)));
    const chatUserIds = uniq(compact(messages.map((e) => e.senderId)));

    const [ chatTeams, chatUsers ] = await Promise.all([
      this.prisma.team.findMany({
        where: { id: { in: chatTeamIds } }
      }),
      this.prisma.user.findMany({
        where: { id: { in: chatUserIds } }
      })
    ]);

    return {
      chat,
      messages,
      chatTeams,
      chatUsers
    };
  }
}
