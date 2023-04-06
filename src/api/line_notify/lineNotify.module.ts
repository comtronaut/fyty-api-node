import { Module } from '@nestjs/common';
import {LineNotifyController} from './lineNotify.controller'
import {NotifyService} from './lineNotify.service'
import {CallbackController} from './callback.controller'
import { PrismaService } from "src/services/prisma.service";

@Module({
    imports: [],
    controllers: [LineNotifyController,CallbackController],
    providers: [NotifyService, PrismaService]
})
export class NotifyModule {}