import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserSubject } from "src/common/subject.decorator";
import { UpdateUserDto } from "src/model/dto/user.dto";
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { UserService } from "../user/user.service";
import { UserSettingsService } from "../user/settings.service";
import { UpdateUserSettingsDto } from "src/model/dto/user-settings.dto";
import { TeamService } from "../team/team.service";
import { AppointmentService } from "../appointment/appointment.service";
import { RoomService } from "../room/room.service";
import { TeampendingService } from "../team/pending.service";
import { UserAvatarService } from "../user/avatar.service";

@Controller("me")
export class MeController {
  constructor(
    private readonly userService: UserService,
    private readonly userAvatarService: UserAvatarService,
    private readonly settingsService: UserSettingsService,
    private readonly teamService: TeamService,
    private readonly appointmentService: AppointmentService,
    private readonly roomService: RoomService,
    private readonly teamPendingService: TeampendingService
  ) {}

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async getMeData(@UserSubject() user: User) {
    return user;
  }

  @UseGuards(UserJwtAuthGuard)
  @Put()
  async putMeData(@UserSubject() user: User, @Body() payload: UpdateUserDto) {
    return await this.userService.update(user.id, payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete()
  async deleteMeData(@UserSubject() user: User) {
    return await this.userService.delete(user.id);
  }

  // settings
  @UseGuards(UserJwtAuthGuard)
  @Get("settings")
  async getMeSettings(@UserSubject() user: User) {
    return await this.settingsService.getByUserId(user.id);
  }

  @UseGuards(UserJwtAuthGuard)
  @Put("settings")
  async putMeSettings(@UserSubject() user: User, @Body() payload: UpdateUserSettingsDto) {
    return await this.settingsService.updateByUserId(user.id, payload);
  }

  // avatars
  @UseGuards(UserJwtAuthGuard)
  @Get("avatars")
  async getMeAvatars(@UserSubject() user: User) {
    return await this.userAvatarService.getFilter(user.id);
  }

  // teams
  @UseGuards(UserJwtAuthGuard)
  @Get("teams")
  async getMeTeams(@UserSubject() user: User) {
    return await this.teamService.getByUserId(user.id);
  }

  // appointments
  @UseGuards(UserJwtAuthGuard)
  @Get("appointments")
  async getMeAppointments(@UserSubject() user: User) {
    return await this.appointmentService.getAppointmentByUserId(user.id);
  }

  // lobby
  @UseGuards(UserJwtAuthGuard)
  @Get("lobby/teams/:id")
  async getJoinedRooms(@Param("id") teamId: string) {
    return await this.roomService.getJoinedAndPendingRoomsByTeamId(teamId);
  }

  // pendings
  @UseGuards(UserJwtAuthGuard)
  @Get("teams/pendings")
  async getPendingByUserId(@UserSubject() user: User) {
    return await this.teamPendingService.getTeamPendingByUser(user.id);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("teams/invitations")
  async getInvitationByUserId(@UserSubject() user: User) {
    return await this.teamPendingService.getTeamInvitationByUser(user.id);
  }
}
