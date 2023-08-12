import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";

import { createPagination } from "common/utils/pagination";
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
      ...createPagination(page, perPage),
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTeamByIdAsAdmin(@Param("id") id: string): Promise<void> {
    return await this.adminTeamsService.deleteSoftly(id);
  }
}
