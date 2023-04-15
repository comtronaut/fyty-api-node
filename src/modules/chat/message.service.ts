import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMessageDto } from "src/model/dto/message.dto";
import { NotifyService } from "src/modules/notification/lineNotify.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lineNotify: NotifyService
  ) {}

  async create({
    waitingKey,
    ...data
  }: CreateMessageDto & { waitingKey: string }) {
    void this.lineNotify.searchUserForChatNotify(data.chatId, data.teamId);

    return await this.prisma.message.create({ data });
  }
}
