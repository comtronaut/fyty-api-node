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
import { PendingStatus, Team, TrainingSource, User } from "@prisma/client";
import { isEmpty } from "lodash";

import { AppointmentService } from "../../appointment/appointment.service";
import { UserSubject } from "common/subject.decorator";
import { CreateTeamMemberDto, UpdateTeamMemberDto } from "model/dto/team-member.dto";
import { CreateTeamPendingDto, UpdateTeamPendingDto } from "model/dto/team-pending.dto";
import { UpdateTeamSettingsDto } from "model/dto/team-settings.dto";
import { CreateTeamDto, UpdateTeamDto } from "model/dto/team.dto";
import {
  CreateTrainingReportDto,
  UpdateTrainingReportDto
} from "model/dto/training-report.dto";
import { CreateTrainingBypassDto, UpdateTrainingDto } from "model/dto/training.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { AppointmentStatus } from "types/local";

import { TeamMemberService } from "../services/member.service";
import { TeamPendingService } from "../services/pending.service";
import { TeamSettingsService } from "../services/settings.service";
import { TeamService } from "../services/team.service";
import { TrainingService } from "../services/training.service";

@Controller("teams")
@UseGuards(UserJwtAuthGuard)
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMemberService: TeamMemberService,
    private readonly teamPendingService: TeamPendingService,
    private readonly teamSettingsService: TeamSettingsService,
    private readonly trainingService: TrainingService,
    private readonly appointmentService: AppointmentService
  ) {}

  @Post()
  async postTeam(@UserSubject() user: User, @Body() payload: CreateTeamDto) {
    return await this.teamService.create(user, payload);
  }

  @Get()
  async getTeams(
    @Query("q") q?: string,
    @Query("gameId") gameId?: string,
    @Query("perPage") perPage?: string,
    @Query("page") page?: string
  ) {
    const clause: Partial<Team> = {
      ...(gameId && { gameId }),
      ...(q && { name: q })
    };

    return await this.teamService.getByFilter({
      ...([ perPage, page ].every(Boolean) && {
        pagination: {
          page: Number(page),
          perPage: Number(perPage)
        }
      }),
      ...(!isEmpty(clause) && {
        clause
      })
    });
  }

  @Get(":id")
  async getTeamById(@Param("id") id: string) {
    return await this.teamService.getById(id);
  }

  @Put(":id")
  async putTeamById(@UserSubject() user: User, @Body() payload: UpdateTeamDto) {
    return await this.teamService.update(payload);
  }

  @Delete(":id")
  async deleteTeamById(@UserSubject() user: User, @Param("id") teamId: string) {
    return await this.teamService.deleteByUser(user.id, teamId);
  }

  // multiple
  @Get("multiple/:ids")
  async getMultipleTeamsByIds(@Param("ids") ids: string) {
    return await this.teamService.getByIds(ids.split(","));
  }

  // detail
  @Get(":id/detail")
  async getTeamDetail(@Param("id") id: string) {
    return await this.teamService.getDetailById(id);
  }

  // settings
  @Get(":id/settings")
  async getTeamSettingsByTeamId(@Param("id") teamId: string) {
    return await this.teamSettingsService.getByTeamId(teamId);
  }

  @Put(":id/settings")
  async putTeamSettingsByTeamId(
    @Param("id") teamId: string,
    @Body() payload: UpdateTeamSettingsDto
  ) {
    return await this.teamSettingsService.update(payload);
  }

  // stats
  @Get(":id/stats")
  async getTeamStatsByTeamId(@Param("id") teamId: string) {
    return await this.trainingService.getTeamStats(teamId);
  }

  // trainings
  @Get(":id/trainings")
  async getTeamTrainingsByTeamId(
    @Param("id") teamId: string,
    @Query("perPage") perPage?: string,
    @Query("page") page?: string
  ) {
    return [ perPage, page ].every(Boolean)
      ? await this.trainingService.getByTeamId(teamId, {
        page: Number(page),
        perPage: Number(perPage)
      })
      : await this.trainingService.getByTeamId(teamId);
  }

  @Post(":id/trainings")
  async createTrainingManually(
    @Param("id") teamId: string,
    @Body() payload: CreateTrainingBypassDto
  ) {
    return await this.trainingService.createBypass(payload, TrainingSource.USER);
  }

  @Get("trainings/:id")
  async getTrainingById(@Param("id") trainingId: string) {
    return await this.trainingService.getById(trainingId);
  }

  @Put("trainings/:id")
  async putTrainingById(
    @Param("id") trainingId: string,
    @Body() payload: UpdateTrainingDto
  ) {
    return await this.trainingService.update(trainingId, payload);
  }

  // training report
  @Get("trainings/:id/reports")
  async getReportByTrainingId(@Param("id") trainingId: string) {
    return await this.trainingService.getReportsByTeamId(trainingId);
  }

  @Post("trainings/:id/reports")
  async postReportByTrainingId(
    @Param("id") trainingId: string,
    @Body() payload: CreateTrainingReportDto
  ) {
    return await this.trainingService.createReport(payload);
  }

  @Get("trainings/reports/:id")
  async getReportById(@Param("id") reportId: string) {
    return await this.trainingService.getReportById(reportId);
  }

  @Put("trainings/reports/:id")
  async putReportById(
    @Param("id") reportId: string,
    @Body() payload: UpdateTrainingReportDto
  ) {
    return await this.trainingService.updateReport(reportId, payload);
  }

  // appointments
  @Get(":id/appointments")
  async getAppointmentsByTeamId(
    @Param("id") teamId: string,
    @Query("status") status?: AppointmentStatus
  ) {
    return await this.appointmentService.getOthersOfTeam(teamId, status);
  }

  // members
  @Get(":id/members")
  async getTeamMemberByTeamId(@Param("id") teamId: string) {
    return await this.teamMemberService.getByTeamId(teamId);
  }

  @Post("members")
  async postTeamMember(@Body() payload: CreateTeamMemberDto) {
    return await this.teamMemberService.create(payload);
  }

  @Put("members/:id")
  async putTeamMemberByTeamId(
    @Param("id") teamMemberId: string,
    @Body() payload: UpdateTeamMemberDto
  ) {
    return await this.teamMemberService.update(teamMemberId, payload);
  }

  @Delete("members/:id")
  async deleteTeamMemberById(@Param("id") teamMemberId: string, @UserSubject() user: User) {
    return await this.teamMemberService.kickMember(teamMemberId, user);
  }

  @Delete("members/:id/leave")
  async deleteTeamMemberByIdAsLeaving(@Param("id") teamMemberId: string) {
    return this.teamMemberService.leaveTeam(teamMemberId);
  }

  // pendings
  @Get(":id/pendings")
  async getTeamPendingsByTeamId(
    @Param("id") teamId: string,
    @Query("status") status?: PendingStatus
  ) {
    return await this.teamPendingService.getTeamPending(teamId, status);
  }

  @Post("pendings")
  async postTeamPending(@Body() payload: CreateTeamPendingDto) {
    return await this.teamPendingService.createTeamPending(payload);
  }

  @Put("pendings/:id")
  async putTeamPendingById(
    @Param("id") teamPendingId: string,
    @Body() payload: UpdateTeamPendingDto
  ) {
    return await this.teamPendingService.updateStatus(teamPendingId, payload);
  }

  @Delete("pendings/:id")
  async deleteTeamPendingById(@Param("id") teamPendingId: string) {
    return await this.teamPendingService.discard(teamPendingId);
  }
}
