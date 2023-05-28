import { Injectable } from "@nestjs/common";

import { CreateMessageDto } from "model/dto/message.dto";
import { NotifyService } from "modules/notification/lineNotify.service";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lineNotify: NotifyService
  ) {}

  async create({ waitingKey, ...data }: CreateMessageDto & { waitingKey: string }) {
    if (data.teamId) {
      void this.lineNotify.searchUserForChatNotify(data.chatId, data.teamId);
    }

    return await this.prisma.message.create({ data });
  }
}
