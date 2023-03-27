import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminJwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateGameDto, UpdateGameDto } from 'src/model/dto/game.dto';
import { AdminGamesService } from './admin-games.service';

@Controller('admins/api/games')
export class GamesController {
  constructor(private readonly adminGamesService: AdminGamesService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Post()
  async addGame(@Body() req: CreateGameDto) {
    return await this.adminGamesService.create(req);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Put(":id")
  async updateGame(@Param("id") gameId: string, @Body() req: UpdateGameDto) {
    return await this.adminGamesService.update(gameId, req);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(":id")
  async deleteGame(@Param("id") gameId: string) {
    return await this.adminGamesService.delete(gameId);
  }

}
