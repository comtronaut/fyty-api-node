import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { GameService } from "./game.service";
import { UseGuards } from '@nestjs/common/decorators';
import { CreateGameDto, UpdateGameDto } from "src/model/dto/game.dto";
import { Debug } from "src/common/debug.decorator";
import { AdminJwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller("api/games")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Post()
  async addGame(@Body() req: CreateGameDto) {
    return this.gameService.create(req);
  }

  @Get()
  async getGame() {
    return this.gameService.getAll();
  }

  @UseGuards(AdminJwtAuthGuard)
  @Put(":id")
  async updateGame(@Param("id") gameId: string, @Body() req: UpdateGameDto) {
    return await this.gameService.update(gameId, req);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(":id")
  async deleteGame(@Param("id") gameId: string) {
    return await this.gameService.delete(gameId);
  }
}
