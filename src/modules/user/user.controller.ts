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
  async getUserDedup(
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
  async getUsersBySearching(@Query("q") q: string, @Query("teamId") teamId?: string) {
    return await this.userService.searchUsers(q, teamId);
  }

  @Get(":id")
  @UseGuards(UserJwtAuthGuard)
  async getUserById(@Param("id") userId: string) {
    return await this.userService.getById(userId);
  }

  @Get(":id/detail")
  @UseGuards(UserJwtAuthGuard)
  async getUserDetailById(@Param("id") userId: string) {
    return await this.userService.getDetailById(userId);
  }

  // multiple
  @Get("multiple/:ids")
  @UseGuards(UserJwtAuthGuard)
  async getMultipleUsersByIds(@Param("ids") ids: string) {
    return await this.userService.getByIds(ids.split(","));
  }

  // avatars
  @Post("avatars")
  @UseGuards(UserJwtAuthGuard)
  async postUserAvatar(@Body() payload: CreateUserAvatarDto) {
    return await this.avatarService.create(payload);
  }

  @Get(":id/avatars")
  @UseGuards(UserJwtAuthGuard)
  async getUserAvatarsByUserId(
    @Param("id") userId: string,
    @Query("gameId") gameId?: string
  ) {
    return await this.avatarService.getFilter(userId, gameId);
  }

  @Put("avatars/:id")
  @UseGuards(UserJwtAuthGuard)
  async putUserAvatarById(
    @Param("id") avatarId: string,
    @Body() payload: UpdateUserAvatarDto
  ) {
    return await this.avatarService.update(avatarId, payload);
  }

  @Delete("avatars/:id")
  @UseGuards(UserJwtAuthGuard)
  async daleteUserAvatarById(@Param("id") avatarId: string) {
    return await this.avatarService.delete(avatarId);
  }
}
