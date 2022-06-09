import { Module } from "@nestjs/common";
import { GameModule } from "./games/game.module";
import { ReviewModule } from "./reviews/review.module";
import { TeamModule } from "./teams/team.module";
import { UserModule } from "./users/user.module";

@Module({
  imports: [
    UserModule,
    GameModule,
    ReviewModule,
    TeamModule,
  ],
  controllers: [],
  providers: []
})
export class ApiModule { }
