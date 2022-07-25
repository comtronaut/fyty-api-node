import { Module } from "@nestjs/common";
import { GameModule } from "./games/game.module";
import { ReviewModule } from "./review/review.module";
import { RoomModule } from "./rooms/room.module";
import { SelectorModule } from "./Selector/selector.module";
import { TeamModule } from "./teams/team.module";
import { UserModule } from "./users/user.module";
import { UtilModule } from "./utils/util.module";

@Module({
  imports: [
    UserModule,
    GameModule,
    TeamModule,
    RoomModule,
    SelectorModule,
    ReviewModule,
    UtilModule
  ],
  controllers: [],
  providers: []
})
export class ApiModule { }
