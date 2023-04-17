import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserSubject } from "src/common/subject.decorator";
import { CreateUserAvatarDto, UpdateUserAvatarDto } from "src/model/dto/user-avatar.dto";
import { CreateUserDto } from "src/model/dto/user.dto";
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { UserAvatarService } from "./avatar.service";
import { UserSettingsService } from "./settings.service";
import { UserService } from "./user.service";

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

  @Get("validation")
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
  async getAll(@Query("q") q: string, @Query("teamId") teamId?: string) {
    return await this.userService.searchUsers(q, teamId);
  }

  @Get(":id")
  @UseGuards(UserJwtAuthGuard)
  async getById(@UserSubject() user: User, @Param("id") id: string) {
    return await this.userService.getById(id);
  }

  @Post("avatars")
  @UseGuards(UserJwtAuthGuard)
  async createUserAvatar(@Body() payload: CreateUserAvatarDto) {
    return this.avatarService.create(payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get(":id/avatars")
  async getUserAvatar(@Param("id") userId: string, @Query("gameId") gameId?: string) {
    return await this.avatarService.getFilter(userId, gameId);
  }

  @Put("avatars/:id")
  async updateUserAvatar(@Param("id") avatarId: string, @Body() payload: UpdateUserAvatarDto) {
    return await this.avatarService.update(avatarId, payload);
  }

  @Delete("avatars/:id")
  async daleteUserAvatar(@Param("id") avatarId: string) {
    return await this.avatarService.delete(avatarId);
  }
}
