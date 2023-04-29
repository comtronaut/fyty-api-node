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
import { CreateUserAvatarDto, UpdateUserAvatarDto } from "model/dto/user-avatar.dto";
import { CreateUserDto } from "model/dto/user.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { UserAvatarService } from "./avatar.service";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
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
  async getById(@Param("id") userId: string) {
    return await this.userService.getById(userId);
  }

  // multiple
  @Get("multiple/:ids")
  @UseGuards(UserJwtAuthGuard)
  async getByIds(@Param("ids") ids: string) {
    return await this.userService.getByIds(ids.split(","));
  }

  // avatars
  @Post("avatars")
  @UseGuards(UserJwtAuthGuard)
  async createUserAvatar(@Body() payload: CreateUserAvatarDto) {
    return await this.avatarService.create(payload);
  }

  @Get(":id/avatars")
  @UseGuards(UserJwtAuthGuard)
  async getUserAvatar(@Param("id") userId: string, @Query("gameId") gameId?: string) {
    return await this.avatarService.getFilter(userId, gameId);
  }

  @Put("avatars/:id")
  @UseGuards(UserJwtAuthGuard)
  async updateUserAvatar(
    @Param("id") avatarId: string,
    @Body() payload: UpdateUserAvatarDto
  ) {
    return await this.avatarService.update(avatarId, payload);
  }

  @Delete("avatars/:id")
  @UseGuards(UserJwtAuthGuard)
  async daleteUserAvatar(@Param("id") avatarId: string) {
    return await this.avatarService.delete(avatarId);
  }
}
