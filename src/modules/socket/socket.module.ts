import { Module } from "@nestjs/common";

import { SocketGateway } from "./socket.gateway";
import { MessageService } from "../chat/message.service";
import { NotifyService } from "../notification/line-notify.service";
import { RoomService } from "../room/room.service";

@Module({
  providers: [ RoomService, MessageService, NotifyService, SocketGateway ]
})
export class SocketModule {}
