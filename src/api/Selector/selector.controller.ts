import { Controller, Get, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Subject } from "src/common/subject.decorator";
import { User } from "src/model/sql-entity/user/user.entity";
import { SelectorService } from "./selector.service";

@Controller("api/selector")
export class SelectorController {
  constructor(private readonly selectorService: SelectorService) {}

  @UseGuards(JwtAuthGuard)
  @Get("room/:id")
  async getMyRoom(@Param("id") id: string) {
    return this.selectorService.getRoom(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("team/:id")
  async getMyTeams(@Param("id") id: string) {
    return this.selectorService.getTeam(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("room/:id/chat")
  async getchat(@Param("id") roomId: string) {
    return this.selectorService.getChat(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMySelf(@Subject() user: User) {
    return this.selectorService.getMe(user);
  }
}
