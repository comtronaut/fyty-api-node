import { Module } from "@nestjs/common";
import { MessageService } from "../chat/message.service";
import { NotifyService } from "../notification/lineNotify.service";
import { RoomService } from "../room/room.service";
import { SocketGateway } from "./socket.gateway";

@Module({
  providers: [ RoomService, MessageService, NotifyService, SocketGateway ]
})
export class SocketModule {}
