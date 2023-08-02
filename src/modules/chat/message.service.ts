import { Injectable } from "@nestjs/common";

import { CreateMessageDto } from "model/dto/message.dto";
import { LineNotifyService } from "modules/notification/line-notify.service";
import { NotificationService } from "modules/notification/notification.service";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lineNotify: LineNotifyService,
    private readonly notificationService: NotificationService
  ) {}

  async create({ waitingKey, ...data }: CreateMessageDto & { waitingKey: string }) {
    if (data.teamId) {
      void this.lineNotify.sendChatMessageNotificationToOthers(data.chatId, data.teamId);
    }
    if (data.senderId) {
      void this.notificationService.sendChatMessageNotificationToOthers(
        data.chatId,
        data.senderId,
        data.message
      );
    }

    return await this.prisma.message.create({ data });
  }
}
