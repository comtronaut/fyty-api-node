import { Controller, Get, Query, Redirect } from "@nestjs/common";

import { NotifyService } from "./lineNotify.service";

@Controller("line-notify-callback")
export class CallbackController {
  constructor(private readonly lineNotifyService: NotifyService) {}

  @Get()
  @Redirect("https://www.fyty-esport.com")
  async callback(@Query("code") code: string, @Query("state") state: string) {
    await this.lineNotifyService.callback(code, state);
  }
}
