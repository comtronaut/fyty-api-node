import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { User } from "@prisma/client";

import { UserSubject } from "common/subject.decorator";
import { CreateTeamLineupDto, UpdateLineupDto } from "model/dto/team-lineup.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

import { LineupService } from "../services/lineup.service";

@Controller("lineups")
@UseGuards(UserJwtAuthGuard)
export class LineupController {
  constructor(private readonly lineupService: LineupService) {}

  @Post()
  async postTeamLineup(@Body() payload: CreateTeamLineupDto) {
    return await this.lineupService.create(payload);
  }

  @Put(":id")
  async putTeamLineupById(
    @UserSubject() user: User,
    @Param("id") lineupId: string,
    @Body() payload: UpdateLineupDto
  ) {
    return await this.lineupService.update(user, lineupId, payload);
  }

  @Get()
  async getTeamLineups(@Query("teamId") teamId: string) {
    return await this.lineupService.getByTeamId(teamId);
  }

  @Get(":id")
  async getTeamLineupById(@Param("id") lineupId: string) {
    return await this.lineupService.getById(lineupId);
  }

  @Get("participant/:id")
  async getTeamLineupsByRoomMemberId(@Param("id") roomMemberId: string) {
    return await this.lineupService.getByRoomMemberId(roomMemberId);
  }

  @Delete(":id")
  async deleteTeamLineupById(@UserSubject() user: User, @Param("id") lineupId: string) {
    return this.lineupService.deleteById(user.id, lineupId);
  }
}
