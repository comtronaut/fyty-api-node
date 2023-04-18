import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UpdateTeamDto } from "src/model/dto/team.dto";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { TeamService } from "src/modules/team/team.service";

@Controller("admin/teams")
@UseGuards(AdminJwtAuthGuard)
export class AdminTeamsController {
  constructor(private readonly adminTeamsService: TeamService) {}

  @Get()
  async getAllTeam() {
    return await this.adminTeamsService.getByFilter({});
  }

  @Get(":id")
  async getTeam(@Param("id") teamId: string) {
    return await this.adminTeamsService.getById(teamId);
  }

  @Put(":id")
  async updateTeam(@Param("id") teamId: string, @Body() payload: UpdateTeamDto) {
    return await this.adminTeamsService.update(payload);
  }

  // constraint
  @Delete(":id")
  async deleteTeam(@Param("id") teamId: string) {
    return await this.adminTeamsService.deleteSoftly(teamId);
  }
}
