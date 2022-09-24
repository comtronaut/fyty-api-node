import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { CreateGameHistoryDto, UpdateGameHistoryDto, UpdateMatchHistoryDto } from "src/model/dto/statistic.dto";
import { GameHistortService } from "./gameHistory.service";
import { TeamStatisticService } from "./statistic.service";


@Controller("api/statistics")
export class StatisticController {
  constructor(
    private readonly gameHistoryService: GameHistortService,
    private readonly statisticService: TeamStatisticService
  ) { }

  // statistic

  @UseGuards(JwtAuthGuard)
  @Get("/team/:id")
  async getTeamStat(
    @Param("id") teamId: string,
  ) {
    return await this.statisticService.getTeamStat(teamId);
  }

  // matches

  @UseGuards(JwtAuthGuard)
  @Get("/matchHistory/team/:id")
  async getAllMatches(
    @Param("id") teamId: string,
  ) {
    return await this.statisticService.getMatches(teamId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/opponent")
  async getMatchesWithOpponent(
    @Body("yourTeamId") yourTeamId: string,
    @Body("opponentTeamId") opponentTeamId: string,
  ) {
    return await this.statisticService.getMatchesWithOpponent(yourTeamId, opponentTeamId);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/matchHistory/:id")
  async updateMatch(
    @Param("id") matchId: string,
    @Body() req: UpdateMatchHistoryDto
  ) {
    return await this.statisticService.updateMatch(matchId,req);
  }

  // game history

  @UseGuards(JwtAuthGuard)    
  @Post("/gameHistory")
  async createGameHistory(
    @Body() req: CreateGameHistoryDto
  ) {
    return await this.gameHistoryService.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/gameHistory/:id")
  async getGameHistory(
    @Param("id") gameHistoryId: string,
  ) {
    return await this.gameHistoryService.getGameHistory(gameHistoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("game/matchHistory/:id")
  async getAllGameHistory(
    @Param("id") matchId: string,
  ) {
    return await this.gameHistoryService.getAllGameHistory(matchId);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/gameHistory/:id")
  async updateGameHistory(
    @Param("id") gameHistoryId: string,
    @Body() req: UpdateGameHistoryDto
  ) {
    return await this.gameHistoryService.updateGameHistory(gameHistoryId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/gameHistory/:id")
  async deleteGameHistory(
    @Param("id") gameHistoryId: string,
  ) {
    return await this.gameHistoryService.deleteGameHistory(gameHistoryId);
  }
}
