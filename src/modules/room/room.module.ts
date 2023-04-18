import { Module } from "@nestjs/common";
import { ChatModule } from "../chat/chat.module";
import { ChatService } from "../chat/chat.service";
import { TeamService } from "../team/team.service";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { RoomPendingService } from "./pending.service";
import { ScheduleModule } from "@nestjs/schedule";
import { NotifyService } from "../notification/lineNotify.service";
import { LobbyService } from "./lobby.service";

@Module({
  imports: [ ChatModule, ScheduleModule.forRoot() ],
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
