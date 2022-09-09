import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Subject } from "src/common/subject.decorator";
import { CreateLineUpDto, UpdateLineUpDto } from "src/model/dto/lineUp.dto";
import { User } from "src/model/sql-entity/user/user.entity";
import { LineUpService } from "./lineUp.service";


@Controller("api/lineups")
export class LineUpController{
    constructor(
        private readonly lineUpService: LineUpService,
    ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addLineUp(
    @Body() req: CreateLineUpDto,
    ) {
    return this.lineUpService.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  async updateLineUp(
    @Subject() user: User,
    @Param("id") lineUpId: string,
    @Body() req: UpdateLineUpDto,
    ) {
    return this.lineUpService.update(user ,lineUpId, req);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllLineups(
    @Query("teamId") teamId: string){

    return this.lineUpService.getLineUps(teamId);

  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async getLineup(
    @Param("id") lineUpId: string){

    return this.lineUpService.getLineUpById(lineUpId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delateLineUps(
    @Subject() user: User,
    @Param("teamId") teamId: string){

    return this.lineUpService.deleteAllLineUps(user.id, teamId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  async delateLineUp(
    @Subject() user: User,
    @Param("id") lineUpId: string){

    return this.lineUpService.deleteLineById(user.id, lineUpId);
  }


}