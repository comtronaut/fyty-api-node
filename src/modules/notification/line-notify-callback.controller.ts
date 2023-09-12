import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";

import env from "common/env.config";

import { LineNotifyService } from "./line-notify.service";

@Controller("line-notify-callback")
export class LineNotifyCallbackController {
  constructor(private readonly lineNotifyService: LineNotifyService) {}

  @Get()
  async callback(@Res() res: Response, @Query("code") code: string, @Query("state") state: string) {
    const [ userId = "", stage ] = state.split(":").filter(Boolean);

    if (stage) {
      res.redirect(`https://${stage}.fyty-esport.com/line-notify-callback?code=${code}&state=${userId}`);
    } else {
      await this.lineNotifyService.callback(code, userId);
      res.redirect(env.NODE_ENV === "development" ? "https://staging.fyty-esport.com" : "https://www.fyty-esport.com");
    }
  }
}
