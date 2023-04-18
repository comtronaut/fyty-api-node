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
import { CreateTeamDto, UpdateTeamDto } from "src/model/dto/team.dto";
import { TeamMemberService } from "./member.service";
import { TeamPendingService } from "./pending.service";
import { TeamService } from "./team.service";
import { CreateTeamMemberDto, UpdateTeamMemberDto } from "src/model/dto/team-member";
import { CreateTeamPendingDto, UpdateTeamPendingDto } from "src/model/dto/team-pending";
import { AppointmentService } from "../appointment/appointment.service";
import { TeamSettingsService } from "./settings.service";

@Controller("teams")
@UseGuards(UserJwtAuthGuard)
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMemberService: TeamMemberService,
    private readonly teamPendingService: TeamPendingService,
    private readonly teamSettingsService: TeamSettingsService,
    private readonly appointmentService: AppointmentService
  ) {}

  @Post()
  async createTeam(@UserSubject() user: User, @Body() payload: CreateTeamDto) {
    return await this.teamService.create(user, payload);
  }

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

  @Get(":id")
  async getTeamById(@Param("id") id: string) {
    return await this.teamService.getById(id);
  }

  @Put(":id")
  async updateTeam(@UserSubject() user: User, @Body() payload: UpdateTeamDto) {
    return await this.teamService.update(payload);
  }

  @Delete(":id")
  async deleteTeam(@UserSubject() user: User, @Param("id") teamId: string) {
    return await this.teamService.deleteByUser(user.id, teamId);
  }

  // settings
  @Get(":id/settings")
  async getSettings(@Param("id") teamId: string) {
    return await this.teamSettingsService.getByTeamId(teamId);
  }

  @Get(":id/settings")
  async updateSettings(@Param("id") teamId: string, payload: any) {
    return await this.teamSettingsService.update(payload);
  }

  // appointments
  @Get(":id/appointments")
  async getTeamAppointments(@Param("id") teamId: string) {
    return await this.appointmentService.getOthersOfTeam(teamId);
  }

  // members
  @Get(":id/members")
  async getMembersByTeamId(@Param("id") teamId: string) {
    return await this.teamMemberService.getByTeamId(teamId);
  }

  @Post("members")
  async createMember(@Body() payload: CreateTeamMemberDto) {
    return await this.teamMemberService.create(payload);
  }

  @Put("members/:id")
  async updateMemberRole(
    @Param("id") teamMemberId: string,
    @Body() payload: UpdateTeamMemberDto
  ) {
    return await this.teamMemberService.update(teamMemberId, payload);
  }

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
