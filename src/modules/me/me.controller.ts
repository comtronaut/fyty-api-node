import { Body, Controller, Delete, Get, Put, Query, UseGuards } from "@nestjs/common";
import { ApiNoContentResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PendingStatus, User } from "@prisma/client";

import { UserSubject } from "common/subject.decorator";
import { AppointmentPackResponseDto } from "model/dto/appointment.dto";
import { TeamPendingDto } from "model/dto/team-pending.dto";
import { TeamDto } from "model/dto/team.dto";
import { UserAvatarDto } from "model/dto/user-avatar.dto";
import { UpdateUserSettingsDto, UserSettingsDto } from "model/dto/user-settings.dto";
import { SecureUserDto, UpdateUserDto, UserDetailResponseDto } from "model/dto/user.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

import { AppointmentService } from "../appointment/appointment.service";
import { TeamPendingService } from "../team/pending.service";
import { TeamService } from "../team/team.service";
import { UserAvatarService } from "../user/avatar.service";
import { UserSettingsService } from "../user/settings.service";
import { UserService } from "../user/user.service";

@Controller("me")
@ApiTags("Me")
@UseGuards(UserJwtAuthGuard)
export class MeController {
  constructor(
    private readonly userService: UserService,
    private readonly userAvatarService: UserAvatarService,
    private readonly settingsService: UserSettingsService,
    private readonly teamService: TeamService,
    private readonly appointmentService: AppointmentService,
    private readonly teamPendingService: TeamPendingService
  ) {}

  @Get()
  @ApiResponse({ type: SecureUserDto })
  async getMeInfo(@UserSubject() user: User): Promise<SecureUserDto> {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Get("detail")
  @ApiResponse({ schema: UserDetailResponseDto.toSchemaObject() })
  async getMeDetail(@UserSubject() user: User): Promise<UserDetailResponseDto> {
    return await this.userService.getDetailById(user.id);
  }

  @Put()
  @ApiResponse({ type: SecureUserDto })
  async putMeInfo(@UserSubject() user: User, @Body() payload: UpdateUserDto): Promise<SecureUserDto> {
    return await this.userService.update(user.id, payload);
  }

  @Delete()
  @ApiNoContentResponse()
  async deleteMeInfo(@UserSubject() user: User): Promise<void> {
    return await this.userService.delete(user.id);
  }

  // settings
  @Get("settings")
  @ApiResponse({ type: UserSettingsDto })
  async getMeSettings(@UserSubject() user: User): Promise<UserSettingsDto> {
    return await this.settingsService.getByUserId(user.id);
  }

  @Put("settings")
  @ApiResponse({ type: UserSettingsDto })
  async putMeSettings(@UserSubject() user: User, @Body() payload: UpdateUserSettingsDto): Promise<UserSettingsDto> {
    return await this.settingsService.updateByUserId(user.id, payload);
  }

  // avatars
  @Get("avatars")
  @ApiResponse({ type: [ UserAvatarDto ] })
  async getMeAvatars(@UserSubject() user: User): Promise<UserAvatarDto[]> {
    return await this.userAvatarService.getFilter(user.id);
  }

  // teams
  @Get("teams")
  @ApiResponse({ type: [ TeamDto ] })
  async getMeTeams(@UserSubject() user: User): Promise<TeamDto[]> {
    return await this.teamService.getByUserId(user.id);
  }

  // appointments
  @Get("appointments")
  @ApiResponse({ type: [ AppointmentPackResponseDto ] })
  async getMeAppointments(@UserSubject() user: User): Promise<AppointmentPackResponseDto[]> {
    return await this.appointmentService.getOthersOfUser(user.id);
  }

  // pendings
  @Get("teams/pendings")
  @ApiResponse({ type: [ TeamPendingDto ] })
  async getMeTeamPendings(
    @UserSubject() user: User,
    @Query("status") status?: PendingStatus
  ): Promise<TeamPendingDto[]> {
    return await this.teamPendingService.getTeamPendingByUser(user.id, status);
  }
}
