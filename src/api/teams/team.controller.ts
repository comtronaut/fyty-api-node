import { Body, Controller, Delete, Get, Param, Post, Put, Query, Sse, UseGuards,MessageEvent } from "@nestjs/common";
import { Debug } from "src/common/debug.decorator";
import { TeamService } from "./team.service";
import { CreateTeamDto, UpdateTeamDto, UpdateTeamMemberDto, CreateTeamMemberDto, CreateTeamPendingDto, UpdateTeamPendingDto } from "src/model/dto/team.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Subject } from "src/common/subject.decorator";
import { User } from "src/model/sql-entity/user/user.entity";
import { TeamMemberService } from "./members/team-member.service";
import { TeampendingService } from "./pending/teampending.service";
import { map, Observable, Subject as SJ } from 'rxjs';

@Controller("api/teams")
export class TeamController {
  private readonly subject = new SJ();
  constructor(
    private readonly teamService: TeamService,
    private readonly teammemberService: TeamMemberService,
    private readonly teampendingService: TeampendingService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTeam(
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
  async getTeamById(
    @Param("id") id: string,
  ) {
    return await this.teamService.getTeam(id);
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
  async deleteTeam(
    @Subject() user: User,
    @Param("id") teamId: string
  ) {

    return await this.teamService.delete(user.id, teamId);
  }

  // team member

  @UseGuards(JwtAuthGuard)
  @Get(":id/members")
  async getMembersByTeamId(
    @Param("id") teamId: string) {
    return this.teammemberService.getMemberByTeamId(teamId);
  }

  @Post("/members")
  async createMember(
    @Body() req: CreateTeamMemberDto,
  ) {
    return this.teammemberService.create(req);
  }

  @Put("/members/:id")
  async updateMemberRole(
    @Param("id") teammemberId: string,
    @Body() req: UpdateTeamMemberDto,) {
    return this.teammemberService.update(teammemberId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/members/:id")
  async kickMember(
    @Param("id") teammemberId: string,
    @Subject() user: User) {
    return this.teammemberService.kickMember(teammemberId,user);
  }

  @Delete("/members/:id/leave")
  async leaveTeam(
    @Param("id") teammemberId: string,) {
    return this.teammemberService.leaveTeam(teammemberId);
  }

  // @Debug()
  // @Delete("/:gameId")
  // async deleteUser(@Param("gameId") gameId: string) {    
  //   return await this.teamService.delete(gameId);
  // }


  // team pending

  @Get(":id/pending")
  async getPendingByTeamId(
    @Param("id") teamId: string) {
    return this.teampendingService.getTeamPending(teamId);
  }

  @Get(":id/invitation")
  async getInvitationByTeamId(
    @Param("id") teamId: string) {
    return this.teampendingService.getTeamInvitation(teamId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/pending/me")
  async getPendingByUserId(
    @Subject() user: User) {
    return this.teampendingService.getTeamPendingByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/invitation/me")
  async getInvitationByUserId(
    @Subject() user: User) {
    return this.teampendingService.getTeamInvitationByUser(user.id);
  }

  @Post("/pending")
  async createPending(
    @Body() req: CreateTeamPendingDto,
  ) {
    // this.subject.next({ req });
    return this.teampendingService.createTeamPending(req);
  }

  @Post("/invitation")
  async createInvitation(
    @Body() req: CreateTeamPendingDto,
  ) {
    // this.subject.next({ req });
    return this.teampendingService.createTeamInvitation(req);
  }

  @Put("/pending/:id")
  async updateStatusTeampending(
    @Param("id") teampendingId: string,
    @Body() req: UpdateTeamPendingDto,) {
    // this.subject.next({ req });
    return this.teampendingService.updateStatus(teampendingId,req);
  }

  @Delete("/pending/:id")
  async discardpending(
    @Param("id") teampendingId: string,) {
    // this.subject.next({ teampendingId });
    return this.teampendingService.discard(teampendingId);
  }
//server sending
  // @Sse("/sse")
  // sse(): Observable<MessageEvent> {
  //   console.log("see activated");
  //   return this.subject.pipe(
  //     map((data: any) => ({ data }))
  //   );
  // }
}
