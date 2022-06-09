import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Debug } from "src/common/debug.decorator";
import { TeamService } from "./team.service";
import { CreateTeamDto, UpdateTeamDto, UpdateTeamMemberDto } from "src/model/dto/team.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Subject } from "src/common/subject.decorator";
import { User } from "src/model/sql-entity/user.entity";
import { TeamMemberService } from "./members/team-member.service";

@Controller("api/teams")
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly memberService: TeamMemberService,
    ) { }

  @Debug()
  @UseGuards(JwtAuthGuard)
  @Post()
  async creteTeam(
    @Subject() user: User,
    @Body() req: CreateTeamDto,
    ) {
    return this.teamService.create(user, req);
  }

  @Get("/:gameId")
  async getTeamsByGameId(@Param("gameId") gameId: string) {
    return this.teamService.getTeamsByGameId(gameId);
  }

  @Debug()
  @Put("/:teamId")
  async updateTeam(
    @Param("teamId") teamId: string, 
    @Body() req: UpdateTeamDto,
    ) {
    return await this.teamService.update(teamId, req);
  }

  @Get("/members/:teamId")
  async getMembersByTeamId(@Param("teamId") teamId: string) {
    return this.memberService.getMemberByTeamId(teamId);
  }

  // @Put("/members")
  // async promoteOrDemoteMember(@Body() req: UpdateTeamMemberDto) {
  //   return this.memberService.promoteOrDemoteMember(req);
  //   }

  // @Delete("/members/")
  // async kickMember(@Body() req: UpdateTeamMemberDto) {
  //   return this.memberService.kickMember(req);
  // }

  // @Debug()
  // @Delete("/:gameId")
  // async deleteUser(@Param("gameId") gameId: string) {    
  //   return await this.teamService.delete(gameId);
  // }
}
