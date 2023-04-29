import { Body, Controller, Delete, Get, Put, Query, UseGuards } from "@nestjs/common";
import { PendingStatus, User } from "@prisma/client";
import { UserSubject } from "common/subject.decorator";
import { UpdateUserSettingsDto } from "model/dto/user-settings.dto";
import { UpdateUserDto } from "model/dto/user.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { AppointmentService } from "../appointment/appointment.service";
import { TeamPendingService } from "../team/pending.service";
import { TeamService } from "../team/team.service";
import { UserAvatarService } from "../user/avatar.service";
import { UserSettingsService } from "../user/settings.service";
import { UserService } from "../user/user.service";

@Controller("me")
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
  async getMeData(@UserSubject() user: User) {
    return user;
  }

  @Put()
  async putMeData(@UserSubject() user: User, @Body() payload: UpdateUserDto) {
    return await this.userService.update(user.id, payload);
  }

  @Delete()
  async deleteMeData(@UserSubject() user: User) {
    return await this.userService.delete(user.id);
  }

  // settings
  @Get("settings")
  async getMeSettings(@UserSubject() user: User) {
    return await this.settingsService.getByUserId(user.id);
  }

  @Put("settings")
  async putMeSettings(@UserSubject() user: User, @Body() payload: UpdateUserSettingsDto) {
    return await this.settingsService.updateByUserId(user.id, payload);
  }

  // avatars
  @Get("avatars")
  async getMeAvatars(@UserSubject() user: User) {
    return await this.userAvatarService.getFilter(user.id);
  }

  // teams
  @Get("teams")
  async getMeTeams(@UserSubject() user: User) {
    return await this.teamService.getByUserId(user.id);
  }

  // appointments
  @Get("appointments")
  async getMeAppointments(@UserSubject() user: User) {
    return await this.appointmentService.getOthersOfUser(user.id);
  }

  // pendings
  @Get("teams/pendings")
  async getPendingByUserId(
    @UserSubject() user: User,
    @Query("status") status?: PendingStatus
  ) {
    return await this.teamPendingService.getTeamPendingByUser(user.id, status);
  }
}
