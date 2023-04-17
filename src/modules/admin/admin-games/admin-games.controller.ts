import { Body, Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateGameDto, UpdateGameDto } from "src/model/dto/game.dto";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { GameService } from "src/modules/game/game.service";

@Controller("admins/games")
export class GamesController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Post()
  async addGame(@Body() payload: CreateGameDto) {
    return await this.gameService.create(payload);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Put(":id")
  async updateGame(@Param("id") gameId: string, @Body() payload: UpdateGameDto) {
    return await this.gameService.update(gameId, payload);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(":id")
  async deleteGame(@Param("id") gameId: string) {
    return await this.gameService.delete(gameId);
  }
}
