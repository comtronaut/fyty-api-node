import { Module } from "@nestjs/common";
import { GameModule } from "./games/game.module";
import { RoomModule } from "./rooms/room.module";
import { TeamModule } from "./teams/team.module";
import { UserModule } from "./users/user.module";

@Module({
  imports: [
    UserModule,
    GameModule,
    TeamModule,
    RoomModule,
  ],
  controllers: [],
  providers: []
})
export class ApiModule { }
