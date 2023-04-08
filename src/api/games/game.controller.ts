import { Controller, Get } from "@nestjs/common";
import { GameService } from "./game.service";

@Controller("api/games")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGame() {
    return this.gameService.getAll();
  }
}
