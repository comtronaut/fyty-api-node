import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { UserSubject } from "src/common/subject.decorator";
import { CreateTeamLineupDto, UpdateLineUpDto } from "src/model/dto/team-lineup.dto";
import { LineupService } from "./lineup.service";

@Controller("lineups")
export class LineupController {
  constructor(private readonly lineUpService: LineupService) {}

  @UseGuards(UserJwtAuthGuard)
  @Post()
  async addLineUp(@Body() payload: CreateTeamLineupDto) {
    return await this.lineUpService.create(payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Put(":id")
  async updateLineUp(
    @UserSubject() user: User,
    @Param("id") lineUpId: string,
    @Body() payload: UpdateLineUpDto
  ) {
    return await this.lineUpService.update(user, lineUpId, payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async getAllLineups(@Query("teamId") teamId: string) {
    return await this.lineUpService.getByTeamId(teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get(":id")
  async getLineup(@Param("id") lineUpId: string) {
    return await this.lineUpService.getById(lineUpId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("participant/:id")
  async getLineups(@Param("id") participantId: string) {
    return await this.lineUpService.getByRoomMemberId(participantId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete()
  async delateLineUps(@UserSubject() user: User, @Param("teamId") teamId: string) {
    return this.lineUpService.deleteAllLineups(user.id, teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete(":id")
  async delateLineUp(@UserSubject() user: User, @Param("id") lineUpId: string) {
    return this.lineUpService.deleteById(user.id, lineUpId);
  }
}
