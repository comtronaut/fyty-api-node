import { Controller, Get, Query, Redirect } from "@nestjs/common";

import { LineNotifyService } from "./line-notify.service";

@Controller("line-notify-callback")
export class LineNotifyCallbackController {
  constructor(private readonly lineNotifyService: LineNotifyService) {}

  @Get()
  @Redirect("https://www.fyty-esport.com")
  async callback(@Query("code") code: string, @Query("state") state: string) {
    await this.lineNotifyService.callback(code, state);
  }
}
