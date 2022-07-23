import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { Debug } from "src/common/debug.decorator";
import { TeamService } from "./team.service";
import { CreateTeamDto, UpdateTeamDto, UpdateTeamMemberDto, CreateTeamMemberDto } from "src/model/dto/team.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Subject } from "src/common/subject.decorator";
import { User } from "src/model/sql-entity/user/user.entity";
import { TeamMemberService } from "./members/team-member.service";

@Controller("api/teams")
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly memberService: TeamMemberService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async creteTeam(
    @Subject() user: User,
    @Body() req: CreateTeamDto,
  ) {
    return this.teamService.create(user, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTeamsByGameId(
    @Param("gameId") gameId: string) {
    if (gameId) {
      return this.teamService.getTeamsByGameId(gameId);
    }
    return this.teamService.getAllTeam();

  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getMembersByTeamId(
    @Param("id") teamId: string) {
    return this.memberService.getMemberByTeamId(teamId);
  }


  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateTeam(
    @Subject() user: User,
    @Body() req: UpdateTeamDto,
  ) {
    return await this.teamService.update(user.id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delateTeam(
    @Subject() user: User,
    @Param("id") teamId: string
  ) {

    return await this.teamService.delete(user.id, teamId);
  }

  @Post("/members")
  async createMember(
    @Body() req: CreateTeamMemberDto,
  ) {
    return this.memberService.create(req);
  }

  @Put("/members/:id")
  async updateMemberRole(
    @Param("id") teammemberId: string,
    @Body() req: UpdateTeamMemberDto,) {
    return this.memberService.update(teammemberId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/members/:id")
  async kickMember(
    @Param("id") teammemberId: string,
    @Subject() user: User) {
    return this.memberService.kickMember(teammemberId,user);
  }

  @Delete("/members/:id/leave")
  async leaveTeam(
    @Param("id") teammemberId: string,) {
    return this.memberService.leaveTeam(teammemberId);
  }

  // @Debug()
  // @Delete("/:gameId")
  // async deleteUser(@Param("gameId") gameId: string) {    
  //   return await this.teamService.delete(gameId);
  // }
}
