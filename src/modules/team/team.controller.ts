import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { UserSubject } from "src/common/subject.decorator";
import { CreateTeamDto, UpdateTeamDto } from "src/model/dto/team.dto";
import { TeamMemberService } from "./member.service";
import { TeampendingService } from "./pending.service";
import { TeamService } from "./team.service";
import { CreateTeamMemberDto, UpdateTeamMemberDto } from "src/model/dto/team-member";
import { CreateTeamPendingDto, UpdateTeamPendingDto } from "src/model/dto/team-pending";

@Controller("teams")
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMemberService: TeamMemberService,
    private readonly teamPendingService: TeampendingService
  ) {}

  @UseGuards(UserJwtAuthGuard)
  @Post()
  async createTeam(@UserSubject() user: User, @Body() payload: CreateTeamDto) {
    return await this.teamService.create(user, payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async getTeamsByGameId(
    @Query("gameId") gameId?: string,
    @Query("perPage") perPage?: string,
    @Query("page") page?: string
  ) {
    return await this.teamService.getByFilter({
      ...([ perPage, page ].every(Boolean) && {
        pagination: {
          page: Number(page),
          perPage: Number(perPage)
        }
      }),
      ...(gameId && {
        clause: {
          gameId
        }
      })
    });
  }

  @UseGuards(UserJwtAuthGuard)
  @Get(":id")
  async getTeamById(@Param("id") id: string) {
    return await this.teamService.getById(id);
  }

  @UseGuards(UserJwtAuthGuard)
  @Put(":id")
  async updateTeam(@UserSubject() user: User, @Body() payload: UpdateTeamDto) {
    return await this.teamService.update(payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete(":id")
  async deleteTeam(@UserSubject() user: User, @Param("id") teamId: string) {
    return await this.teamService.deleteByUser(user.id, teamId);
  }

  // members
  @UseGuards(UserJwtAuthGuard)
  @Get(":id/members")
  async getMembersByTeamId(@Param("id") teamId: string) {
    return await this.teamMemberService.getTeamId(teamId);
  }

  @Post("members")
  async createMember(@Body() payload: CreateTeamMemberDto) {
    return await this.teamMemberService.create(payload);
  }

  @Put("members/:id")
  async updateMemberRole(@Param("id") teamMemberId: string, @Body() payload: UpdateTeamMemberDto) {
    return await this.teamMemberService.update(teamMemberId, payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete("members/:id")
  async kickMember(@Param("id") teamMemberId: string, @UserSubject() user: User) {
    return await this.teamMemberService.kickMember(teamMemberId, user);
  }

  @Delete("members/:id/leave")
  async leaveTeam(@Param("id") teamMemberId: string) {
    return this.teamMemberService.leaveTeam(teamMemberId);
  }

  // pendings
  @Get(":id/pending")
  async getPendingByTeamId(@Param("id") teamId: string) {
    return await this.teamPendingService.getTeamPending(teamId);
  }

  @Get(":id/invitation")
  async getInvitationByTeamId(@Param("id") teamId: string) {
    return await this.teamPendingService.getTeamInvitation(teamId);
  }

  @Post("pending")
  async createPending(@Body() payload: CreateTeamPendingDto) {
    return await this.teamPendingService.createTeamPending(payload);
  }

  @Post("invitation")
  async createInvitation(@Body() payload: CreateTeamPendingDto) {
    return await this.teamPendingService.createTeamInvitation(payload);
  }

  @Put("pending/:id")
  async updateStatusTeampending(
    @Param("id") teampendingId: string,
    @Body() payload: UpdateTeamPendingDto
  ) {
    return await this.teamPendingService.updateStatus(teampendingId, payload);
  }

  @Delete("pending/:id")
  async discardpending(@Param("id") teampendingId: string) {
    return await this.teamPendingService.discard(teampendingId);
  }
}
