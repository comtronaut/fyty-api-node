import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Debug } from "src/common/debug.decorator";
import { TeamService } from "./team.service";
import { CreateTeamDto } from "src/model/dto/team.dto";

@Controller("api/teams")
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Debug()
  @Post()
  async addTeam(@Body() req: CreateTeamDto) {
    return this.teamService.create(req);
  }

  @Get("/:gameId")
  async getTeamsByGameId(@Param("gameId") gameId: string) {
    return this.teamService.getTeamsByGameId(gameId);
  }

  // @Debug()
  // @Put("/:teamId")
  // async updateTeam(
  //   @Param("gameId") gameId: string, 
  //   @Body() req: UpdateGameDto,
  //   ) {
  //   return await this.teamService.update(gameId, req);
  // }

  // @Debug()
  // @Delete("/:gameId")
  // async deleteUser(@Param("gameId") gameId: string) {    
  //   return await this.teamService.delete(gameId);
  // }
}
