import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { Debug } from "src/common/debug.decorator";
import { MessageService } from "./message.service";

@Controller("api/chats")
export class ChatController {
  constructor(private readonly messageService: MessageService) {}

  @Get("/:chatId")
  async getMesssagesFromChatId(@Param("chatId") chatId: string) {
    return this.messageService.getMesssagesFromChatId(chatId);
  }
}
