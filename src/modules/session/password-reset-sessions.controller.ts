import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { UserRecoverySessionService } from "./password-reset-sessions.service";

@Controller("password-reset-session")
export class UserRecoverySessionController {
  constructor(private readonly service: UserRecoverySessionService) {}

  @Get("info")
  async getInfo(@Query() query: Prisma.UserRecoverySessionWhereUniqueInput) {
    return await this.service.get(query);
  }

  @Post("request")
  async requestToken(@Body("email") email: string) {
    return await this.service.createByUserEmail(email);
  }

  @Post("reset")
  async addUser(@Body("password") password: string, @Body("token") token: string) {
    return await this.service.resetToken(token, password);
  }
}
