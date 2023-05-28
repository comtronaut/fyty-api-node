import { Controller, Get, Param, UseGuards } from "@nestjs/common";

import { ChatService } from "./chat.service";
import { UserJwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@Controller("chats")
@UseGuards(UserJwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(":id")
  async getChatById(@Param("id") chatId: string) {
    return this.chatService.getChatWithMessages(chatId);
  }
}
