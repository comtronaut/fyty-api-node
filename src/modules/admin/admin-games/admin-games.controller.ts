import { Body, Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";

import { CreateGameDto, UpdateGameDto } from "model/dto/game.dto";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { GameService } from "modules/game/game.service";

@Controller("admin/games")
@UseGuards(AdminJwtAuthGuard)
export class AdminGamesController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGameAsAdmin(@Body() payload: CreateGameDto) {
    return await this.gameService.create(payload);
  }

  @Put(":id")
  async updateGameByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateGameDto) {
    return await this.gameService.update(id, payload);
  }

  @Delete(":id")
  async deleteGameByIdAsAdmin(@Param("id") id: string): Promise<void> {
    await this.gameService.delete(id);
  }
}
