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
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { UserSubject } from "src/common/subject.decorator";
import {
  CreateTeamDto,
  CreateTeamMemberDto,
  CreateTeamPendingDto,
  UpdateTeamDto,
  UpdateTeamMemberDto,
  UpdateTeamPendingDto
} from "src/model/dto/team.dto";
import { TeamMemberService } from "./member.service";
import { TeampendingService } from "./pending.service";
import { TeamService } from "./team.service";

@Controller("api/teams")
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teammemberService: TeamMemberService,
    private readonly teampendingService: TeampendingService
  ) {}

  @UseGuards(UserJwtAuthGuard)
  @Post()
  async createTeam(@UserSubject() user: User, @Body() req: CreateTeamDto) {
    return await this.teamService.create(user, req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async getTeamsByGameId(@Param("gameId") gameId: string) {
    if (gameId) {
      return await this.teamService.getTeamsByGameId(gameId);
    }
    return await this.teamService.getAllTeam();
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("me")
  async getMyTeam(@UserSubject() user: User) {
    return await this.teamService.getMyTeam(user.id);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get(":id")
  async getTeamById(@Param("id") id: string) {
    return await this.teamService.getTeam(id);
  }

  @UseGuards(UserJwtAuthGuard)
  @Put(":id")
  async updateTeam(@UserSubject() user: User, @Body() req: UpdateTeamDto) {
    return await this.teamService.update(user.id, req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete(":id")
  async deleteTeam(@UserSubject() user: User, @Param("id") teamId: string) {
    return await this.teamService.delete(user.id, teamId);
  }

  // team member

  @UseGuards(UserJwtAuthGuard)
  @Get(":id/members")
  async getMembersByTeamId(@Param("id") teamId: string) {
    return await this.teammemberService.getMemberByTeamId(teamId);
  }

  @Post("members")
  async createMember(@Body() req: CreateTeamMemberDto) {
    return await this.teammemberService.create(req);
  }

  @Put("members/:id")
  async updateMemberRole(
    @Param("id") teamMemberId: string,
    @Body() req: UpdateTeamMemberDto
  ) {
    return await this.teammemberService.update(teamMemberId, req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete("members/:id")
  async kickMember(
    @Param("id") teamMemberId: string,
    @UserSubject() user: User
  ) {
    return await this.teammemberService.kickMember(teamMemberId, user);
  }

  @Delete("members/:id/leave")
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

  @UseGuards(UserJwtAuthGuard)
  @Get("pending/me")
  async getPendingByUserId(@UserSubject() user: User) {
    return await this.teampendingService.getTeamPendingByUser(user.id);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("invitation/me")
  async getInvitationByUserId(@UserSubject() user: User) {
    return await this.teampendingService.getTeamInvitationByUser(user.id);
  }

  @Post("pending")
  async createPending(@Body() req: CreateTeamPendingDto) {
    // this.subject.next({ req });
    return await this.teampendingService.createTeamPending(req);
  }

  @Post("invitation")
  async createInvitation(@Body() req: CreateTeamPendingDto) {
    return await this.teampendingService.createTeamInvitation(req);
  }

  @Put("pending/:id")
  async updateStatusTeampending(
    @Param("id") teampendingId: string,
    @Body() req: UpdateTeamPendingDto
  ) {
    return await this.teampendingService.updateStatus(teampendingId, req);
  }

  @Delete("pending/:id")
  async discardpending(@Param("id") teampendingId: string) {
    // this.subject.next({ teampendingId });
    return await this.teampendingService.discard(teampendingId);
  }

  // server sending
  // @Sse("sse")
  // sse(): Observable<MessageEvent> {
  //   console.log("see activated");
  //   return this.subject.pipe(
  //     map((data: any) => ({ data }))
  //   );
  // }
}
