import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { NotifyService } from './lineNotify.service';

@Controller('callback')
export class CallbackController {
    constructor(private readonly lineNotifyService: NotifyService) {}

    @Get()
    // @Redirect('http://localhost:3000/')
    async callback(@Query('code') code: string, @Query('state') state: string) {
        await this.lineNotifyService.callback(code, state);
    }   
}