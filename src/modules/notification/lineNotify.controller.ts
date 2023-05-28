import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";

import { Debug } from "common/debug.decorator";

import { NotifyService } from "./lineNotify.service";

@Controller("notify")
export class LineNotifyController {
  constructor(private lineNotifyService: NotifyService) {}

  @Post()
  @Debug()
  async sendNotification(
    @Body("message") message: string,
    @Body("token") token: string
  ): Promise<void> {
    await this.lineNotifyService.sendNotification(message, token);
  }

  @Get()
  async getLine(@Res() res: Response, @Query("user_id") state: string): Promise<void> {
    const url = await this.lineNotifyService.getAuthorizeUrl(state);
    res.redirect(url);
  }
}
