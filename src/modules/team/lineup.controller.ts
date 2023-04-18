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
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { UserSubject } from "src/common/subject.decorator";
import { CreateTeamLineupDto, UpdateLineupDto } from "src/model/dto/team-lineup.dto";
import { LineupService } from "./lineup.service";

@Controller("lineups")
export class LineupController {
  constructor(private readonly lineupService: LineupService) {}

  @UseGuards(UserJwtAuthGuard)
  @Post()
  async addLineup(@Body() payload: CreateTeamLineupDto) {
    return await this.lineupService.create(payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Put(":id")
  async updateLineup(
    @UserSubject() user: User,
    @Param("id") lineupId: string,
    @Body() payload: UpdateLineupDto
  ) {
    return await this.lineupService.update(user, lineupId, payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async getAllLineups(@Query("teamId") teamId: string) {
    return await this.lineupService.getByTeamId(teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get(":id")
  async getLineup(@Param("id") lineupId: string) {
    return await this.lineupService.getById(lineupId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("participant/:id")
  async getLineups(@Param("id") participantId: string) {
    return await this.lineupService.getByRoomMemberId(participantId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete()
  async delateLineups(@UserSubject() user: User, @Param("teamId") teamId: string) {
    return this.lineupService.deleteAllLineups(user.id, teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete(":id")
  async delateLineup(@UserSubject() user: User, @Param("id") lineupId: string) {
    return this.lineupService.deleteById(user.id, lineupId);
  }
}
