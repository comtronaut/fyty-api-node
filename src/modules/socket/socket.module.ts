import { Module } from "@nestjs/common";

import { NotificationService } from "modules/notification/notification.service";

import { SocketGateway } from "./socket.gateway";
import { MessageService } from "../chat/message.service";
import { LineNotifyService } from "../notification/line-notify.service";
import { RoomService } from "../room/room.service";

@Module({
  providers: [
    RoomService,
    MessageService,
    LineNotifyService,
    NotificationService,
    SocketGateway
  ]
})
export class SocketModule {}
