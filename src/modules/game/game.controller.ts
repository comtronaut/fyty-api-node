import { Controller, Get } from "@nestjs/common";

import { GameService } from "./game.service";

@Controller("games")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGames() {
    return await this.gameService.getAll();
  }
}
