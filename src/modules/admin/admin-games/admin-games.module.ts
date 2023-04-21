import { Module } from "@nestjs/common";
import { GamesController } from "./admin-games.controller";
import { GameService } from "modules/game/game.service";

@Module({
  controllers: [ GamesController ],
  providers: [ GameService ]
})
export class AdminGamesModule {}
