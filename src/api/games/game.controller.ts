import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GameService } from "./game.service";
import { CreateGameDto, UpdateGameDto } from "src/model/dto/game.dto";
import { Debug } from "src/common/debug.decorator";

@Controller("api/games")
export class GameController {
  constructor(private readonly gameService: GameService) { }

  // only admin can add game
  // @Debug()
  @Post()
  async addGame(@Body() req: CreateGameDto) {
    return this.gameService.create(req);
  }

  @Get()
  async getGame() {
    return this.gameService.getAllGames();
  }

  // only admin can edit game
  // @Debug()
  @Put(":id")
  async updateGame(
    @Param("id") gameId: string, 
    @Body() req: UpdateGameDto,
    ) {
    return await this.gameService.update(gameId, req);
  }

  // @Debug()
  @Delete(":id")
  async deleteGame(
    @Param("id") gameId: string
    ) {    
    return await this.gameService.delete(gameId);
  }
}
