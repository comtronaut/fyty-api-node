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
import { TeamService } from "modules/team/services/team.service";

@Controller("admin/teams")
@UseGuards(AdminJwtAuthGuard)
export class AdminTeamsController {
  constructor(private readonly adminTeamsService: TeamService) {}

  @Get()
  async getAllTeamsAsAdmin(
    @Query("q") q?: string,
    @Query("page") page?: string,
    @Query("perPage") perPage?: string
  ) {
    return await this.adminTeamsService.getFilter({
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
  async getTeamByIdAsAdmin(@Param("id") id: string) {
    return await this.adminTeamsService.getById(id);
  }

  @Put(":id")
  async updateTeamByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateTeamDto) {
    return await this.adminTeamsService.update(payload);
  }

  @Delete(":id")
  async deleteTeamByIdAsAdmin(@Param("id") id: string) {
    return await this.adminTeamsService.deleteSoftly(id);
  }
}
