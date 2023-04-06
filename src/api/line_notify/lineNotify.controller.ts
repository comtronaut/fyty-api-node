import { Controller, Post, Body, Get, Res, UseGuards, Query } from '@nestjs/common';
import { NotifyService } from './lineNotify.service';
import { UserJwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UserSubject } from 'src/common/subject.decorator';
import { User } from "@prisma/client";

@Controller('notify')
export class LineNotifyController {
    constructor(private lineNotifyService: NotifyService) {}

    @Post()
    async sendNotification(@Body('message') message: string, @Body('token') token: string): Promise<void> {
        await this.lineNotifyService.sendNotification(message, token);
    }

    @Get()
    async getLine(@Res() res:any, @Query('user_id') state: string): Promise<void> {
        await this.lineNotifyService.getLine(res,state);
    }

}