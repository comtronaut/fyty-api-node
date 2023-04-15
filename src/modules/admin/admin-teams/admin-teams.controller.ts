import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { AdminTeamsService } from "./admin-teams.service";
import { UpdateTeamDto } from "src/model/dto/team.dto";

@Controller("admins/api/teams")
export class AdminTeamsController {
  constructor(private readonly adminTeamsService: AdminTeamsService) {}

  @Get()
  @UseGuards(AdminJwtAuthGuard)
  async getAllTeam() {
    return await this.adminTeamsService.getAllTeams();
  }

  @Get(":id")
  @UseGuards(AdminJwtAuthGuard)
  async getTeam(@Param("id") teamId: string) {
    return await this.adminTeamsService.getTeam(teamId);
  }

  @Put(":id")
  @UseGuards(AdminJwtAuthGuard)
  async updateTeam(@Param("id") teamId: string, @Body() payload: UpdateTeamDto) {
    return await this.adminTeamsService.updateTeamDetail(teamId, payload);
  }

  // constraint
  @Delete(":id")
  @UseGuards(AdminJwtAuthGuard)
  async deleteTeam(@Param("id") teamId: string) {
    return await this.adminTeamsService.deleteTeam(teamId);
  }
}
