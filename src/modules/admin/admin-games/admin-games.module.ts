import { Module } from "@nestjs/common";

import { GameService } from "modules/game/game.service";

import { GamesController } from "./admin-games.controller";

@Module({
  controllers: [ GamesController ],
  providers: [ GameService ]
})
export class AdminGamesModule {}
