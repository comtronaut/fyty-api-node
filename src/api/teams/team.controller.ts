import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";
import { User } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Subject } from "src/common/subject.decorator";
import {
  CreateTeamDto,
  CreateTeamMemberDto,
  CreateTeamPendingDto,
  UpdateTeamDto,
  UpdateTeamMemberDto,
  UpdateTeamPendingDto
} from "src/model/dto/team.dto";
import { TeamMemberService } from "./members/team-member.service";
import { TeampendingService } from "./pending/teampending.service";
import { TeamService } from "./team.service";

@Controller("api/teams")
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teammemberService: TeamMemberService,
    private readonly teampendingService: TeampendingService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTeam(@Subject() user: User, @Body() req: CreateTeamDto) {
    return await this.teamService.create(user, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTeamsByGameId(@Param("gameId") gameId: string) {
    if (gameId) {
      return await this.teamService.getTeamsByGameId(gameId);
    }
    return await this.teamService.getAllTeam();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  async getMyTeam(@Subject() user: User) {
    return await this.teamService.getMyTeam(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async getTeamById(@Param("id") id: string) {
    return await this.teamService.getTeam(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateTeam(@Subject() user: User, @Body() req: UpdateTeamDto) {
    return await this.teamService.update(user.id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteTeam(@Subject() user: User, @Param("id") teamId: string) {
    return await this.teamService.delete(user.id, teamId);
  }

  // team member

  @UseGuards(JwtAuthGuard)
  @Get(":id/members")
  async getMembersByTeamId(@Param("id") teamId: string) {
    return await this.teammemberService.getMemberByTeamId(teamId);
  }

  @Post("/members")
  async createMember(@Body() req: CreateTeamMemberDto) {
    return await this.teammemberService.create(req);
  }

  @Put("/members/:id")
  async updateMemberRole(
    @Param("id") teamMemberId: string,
    @Body() req: UpdateTeamMemberDto
  ) {
    return await this.teammemberService.update(teamMemberId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/members/:id")
  async kickMember(@Param("id") teamMemberId: string, @Subject() user: User) {
    return await this.teammemberService.kickMember(teamMemberId, user);
  }

  @Delete("/members/:id/leave")
  async leaveTeam(@Param("id") teamMemberId: string) {
    return this.teammemberService.leaveTeam(teamMemberId);
  }

  // team pending

  @Get(":id/pending")
  async getPendingByTeamId(@Param("id") teamId: string) {
    return await this.teampendingService.getTeamPending(teamId);
  }

  @Get(":id/invitation")
  async getInvitationByTeamId(@Param("id") teamId: string) {
    return await this.teampendingService.getTeamInvitation(teamId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/pending/me")
  async getPendingByUserId(@Subject() user: User) {
    return await this.teampendingService.getTeamPendingByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/invitation/me")
  async getInvitationByUserId(@Subject() user: User) {
    return await this.teampendingService.getTeamInvitationByUser(user.id);
  }

  @Post("/pending")
  async createPending(@Body() req: CreateTeamPendingDto) {
    // this.subject.next({ req });
    return await this.teampendingService.createTeamPending(req);
  }

  @Post("/invitation")
  async createInvitation(@Body() req: CreateTeamPendingDto) {
    return await this.teampendingService.createTeamInvitation(req);
  }

  @Put("/pending/:id")
  async updateStatusTeampending(
    @Param("id") teampendingId: string,
    @Body() req: UpdateTeamPendingDto
  ) {
    return await this.teampendingService.updateStatus(teampendingId, req);
  }

  @Delete("/pending/:id")
  async discardpending(@Param("id") teampendingId: string) {
    // this.subject.next({ teampendingId });
    return await this.teampendingService.discard(teampendingId);
  }

  // server sending
  // @Sse("/sse")
  // sse(): Observable<MessageEvent> {
  //   console.log("see activated");
  //   return this.subject.pipe(
  //     map((data: any) => ({ data }))
  //   );
  // }
}
