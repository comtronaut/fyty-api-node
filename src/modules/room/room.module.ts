import { Module } from "@nestjs/common";

import { ImageService } from "modules/image/image.service";

import { LobbyService } from "./lobby.service";
import { RoomPendingService } from "./pending.service";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { ChatModule } from "../chat/chat.module";
import { ChatService } from "../chat/chat.service";
import { LineNotifyService } from "../notification/line-notify.service";
import { TeamService } from "../team/services/team.service";

@Module({
  imports: [ ChatModule ],
  controllers: [ RoomController ],
  providers: [
    RoomService,
    ChatService,
    TeamService,
    RoomPendingService,
    LobbyService,
    LineNotifyService,
    ImageService
  ]
})
export class RoomModule {}
