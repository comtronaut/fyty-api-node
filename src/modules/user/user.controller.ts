import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";
import { UserSubject } from "src/common/subject.decorator";
import { UpdateUserSettingsDto } from "src/model/dto/user-settings.dto";
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";
import { UserAvatarService } from "./avatar.service";
import { UserSettingsService } from "./settings.service";
import { UserService } from "./user.service";
import { CreateUserAvatarDto, UpdateUserAvatarDto } from "src/model/dto/user-avatar.dto";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly settingsService: UserSettingsService,
    private readonly avatarService: UserAvatarService
  ) {}

  // user
  @Post()
  async addUser(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @Get("utils/validation")
  async validateUserDuplication(
    @Query("username") username?: string,
    @Query("mobilePhone") mobilePhone?: string,
    @Query("email") email?: string
  ) {
    return await this.userService.getDuplicationResult({
      username,
      email,
      mobilePhone
    });
  }

  @Get()
  @UseGuards(UserJwtAuthGuard)
  async getAll(@Query("q") q: string, @Query("teamId") teamId: string, @UserSubject() user: User) {
    return await this.userService.searchUsers(q, teamId);
  }

  @Get(":id")
  @UseGuards(UserJwtAuthGuard)
  async getById(@UserSubject() user: User, @Param("id") id: string) {
    return await this.userService.getById(id);
  }

  @Post("avatar")
  @UseGuards(UserJwtAuthGuard)
  async createUserAvatar(@Body() req: CreateUserAvatarDto) {
    return this.avatarService.createUserAvatar(req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("avatar/game/:id")
  async getUserAvatarBygameId(@UserSubject() user: User, @Param("id") gameId: string) {
    return await this.avatarService.getUserAvatarByGameId(gameId, user);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("avatar/other") // new
  async getUserAvatar(@Query("userId") userId: string, @Query("gameId") gameId: string) {
    return await this.avatarService.getUserAvatar(userId, gameId);
  }

  @Put("avatar/:id")
  async updateUserAvatar(@Param("id") avatarId: string, @Body() req: UpdateUserAvatarDto) {
    return await this.avatarService.update(avatarId, req);
  }

  @Delete("avatar/:id")
  async daleteUserAvatar(@Param("id") avatarId: string) {
    return await this.avatarService.deleteUserAvatar(avatarId);
  }
}
