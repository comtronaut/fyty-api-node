import { Module } from "@nestjs/common";
import { ChatModule } from "../chat/chat.module";
import { MessageService } from "../chat/message.service";
import { RoomModule } from "../room/room.module";
import { RoomService } from "../room/room.service";
import { SocketGateway } from "./socket.gateway";
import { NotifyService } from "../notification/lineNotify.service";

@Module({
  imports: [ ChatModule, RoomModule ],
  controllers: [ ],
  providers: [
    RoomService,
    MessageService,
    NotifyService,
    SocketGateway
  ]
})
export class SocketModule {}
