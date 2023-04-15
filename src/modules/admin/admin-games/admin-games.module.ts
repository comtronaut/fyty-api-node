import { Module } from "@nestjs/common";
import { GamesController } from "./admin-games.controller";
import { AdminGamesService } from "./admin-games.service";

@Module({
  controllers: [ GamesController ],
  providers: [ AdminGamesService ]
})
export class AdminGamesModule {}
