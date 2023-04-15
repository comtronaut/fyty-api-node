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
import { CreateLineUpDto, UpdateLineUpDto } from "src/model/dto/team-lineup.dto";
import { LineUpService } from "./lineup.service";

@Controller("api/lineups")
export class LineUpController {
  constructor(private readonly lineUpService: LineUpService) {}

  @UseGuards(UserJwtAuthGuard)
  @Post()
  async addLineUp(@Body() req: CreateLineUpDto) {
    return await this.lineUpService.create(req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Put(":id")
  async updateLineUp(
    @UserSubject() user: User,
    @Param("id") lineUpId: string,
    @Body() req: UpdateLineUpDto
  ) {
    return await this.lineUpService.update(user, lineUpId, req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async getAllLineups(@Query("teamId") teamId: string) {
    return await this.lineUpService.getLineUps(teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get(":id")
  async getLineup(@Param("id") lineUpId: string) {
    return await this.lineUpService.getLineUpById(lineUpId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("participant/:id")
  async getLineups(@Param("id") participantId: string) {
    return await this.lineUpService.getLineUpsByParti(participantId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete()
  async delateLineUps(
    @UserSubject() user: User,
    @Param("teamId") teamId: string
  ) {
    return this.lineUpService.deleteAllLineUps(user.id, teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete(":id")
  async delateLineUp(@UserSubject() user: User, @Param("id") lineUpId: string) {
    return this.lineUpService.deleteById(user.id, lineUpId);
  }
}
