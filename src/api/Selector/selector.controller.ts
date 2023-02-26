import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserJwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UserSubject } from "src/common/subject.decorator";
import { SelectorService } from "./selector.service";

@Controller("api/selector")
export class SelectorController {
  constructor(private readonly selectorService: SelectorService) {}

  @UseGuards(UserJwtAuthGuard)
  @Get("room/:id")
  async getMyRoom(@Param("id") id: string) {
    return this.selectorService.getRoom(id);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("room/:id/chat")
  async getchat(@Param("id") roomId: string) {
    return this.selectorService.getChat(roomId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("me")
  async getMySelf(@UserSubject() user: User) {
    return this.selectorService.getMe(user);
  }
}
