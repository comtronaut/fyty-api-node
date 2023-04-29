import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { UpdateTeamDto } from "model/dto/team.dto";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { TeamService } from "modules/team/team.service";

@Controller("admin/teams")
@UseGuards(AdminJwtAuthGuard)
export class AdminTeamsController {
  constructor(private readonly adminTeamsService: TeamService) {}

  @Get()
  async getAllTeam(
    @Query("q") q?: string,
    @Query("page") page?: string,
    @Query("perPage") perPage?: string
  ) {
    return await this.adminTeamsService.getByFilter({
      ...([ page, perPage ].every(Boolean) && {
        pagination: {
          page: Number(page),
          perPage: Number(perPage)
        }
      }),
      clause: {
        ...(q && { name: q })
      }
    });
  }

  @Get(":id")
  async getTeam(@Param("id") teamId: string) {
    return await this.adminTeamsService.getById(teamId);
  }

  @Put(":id")
  async updateTeam(@Param("id") teamId: string, @Body() payload: UpdateTeamDto) {
    return await this.adminTeamsService.update(payload);
  }

  @Delete(":id")
  async deleteTeam(@Param("id") teamId: string) {
    return await this.adminTeamsService.deleteSoftly(teamId);
  }
}
