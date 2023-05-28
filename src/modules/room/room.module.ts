import { Module } from "@nestjs/common";

import { LobbyService } from "./lobby.service";
import { RoomPendingService } from "./pending.service";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { ChatModule } from "../chat/chat.module";
import { ChatService } from "../chat/chat.service";
import { NotifyService } from "../notification/lineNotify.service";
import { TeamService } from "../team/team.service";

@Module({
  imports: [ ChatModule ],
  controllers: [ RoomController ],
  providers: [
    RoomService,
    ChatService,
    TeamService,
    RoomPendingService,
    LobbyService,
    NotifyService
  ]
})
export class RoomModule {}
