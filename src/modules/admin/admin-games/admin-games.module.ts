import { Module } from "@nestjs/common";

import { GameService } from "modules/game/game.service";

import { AdminGamesController } from "./admin-games.controller";

@Module({
  controllers: [ AdminGamesController ],
  providers: [ GameService ]
})
export class AdminGamesModule {}
