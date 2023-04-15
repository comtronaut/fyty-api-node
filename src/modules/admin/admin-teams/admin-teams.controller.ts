import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UpdateTeamDto } from "src/model/dto/team.dto";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { TeamService } from "src/modules/team/team.service";

@Controller("admins/teams")
export class AdminTeamsController {
  constructor(private readonly adminTeamsService: TeamService) {}

  @Get()
  @UseGuards(AdminJwtAuthGuard)
  async getAllTeam() {
    return await this.adminTeamsService.getAll();
  }

  @Get(":id")
  @UseGuards(AdminJwtAuthGuard)
  async getTeam(@Param("id") teamId: string) {
    return await this.adminTeamsService.getById(teamId);
  }

  @Put(":id")
  @UseGuards(AdminJwtAuthGuard)
  async updateTeam(@Param("id") teamId: string, @Body() payload: UpdateTeamDto) {
    return await this.adminTeamsService.update(payload);
  }

  // constraint
  @Delete(":id")
  @UseGuards(AdminJwtAuthGuard)
  async deleteTeam(@Param("id") teamId: string) {
    return await this.adminTeamsService.deleteByAdmin(teamId);
  }
}
