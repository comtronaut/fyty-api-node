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
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";
import { UserSubject } from "src/common/subject.decorator";
import { UserService } from "./user.service";
import {
  CreateUserAvatarDto,
  UpdateUserAvatarDto
} from "src/model/dto/user.dto";
import { UserAvatarService } from "./user-avatars/avatar.service";
import { UserJwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";
import { User } from "@prisma/client";

@Controller("api/users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: UserAvatarService
  ) {}

  @Post()
  async addUser(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @Get("utils/validation")
  async validateUserDuplication(
    @Query("username") username?: string,
    @Query("email") email?: string
  ) {
    return await this.userService.getDuplicationResult({ username, email });
  }

  @Get()
  @UseGuards(UserJwtAuthGuard)
  async getAll(
    @Query("q") q: string,
    @Query("teamId") teamId: string,
    @UserSubject() user: User
  ) {
    return await this.userService.searchUsers(q, teamId);
  }

  @Get("me")
  @UseGuards(UserJwtAuthGuard)
  async getSelf(@UserSubject() user: User) {
    return user;
  }

  @Get(":id")
  @UseGuards(UserJwtAuthGuard)
  async getById(@UserSubject() user: User, @Param("id") id: string) {
    return await this.userService.getUserById(id);
  }

  @Put("me")
  @UseGuards(UserJwtAuthGuard)
  async updateUser(@UserSubject() user: User, @Body() req: UpdateUserDto) {
    return await this.userService.update(user, req);
  }

  @Debug()
  @UseGuards(UserJwtAuthGuard)
  @Delete("me")
  async deleteUser(@UserSubject() user: User) {
    return await this.userService.delete(user.id);
  }

  // UserAvatar
  @Post("avatar")
  async createUserAvatar(@Body() req: CreateUserAvatarDto) {
    return this.avatarService.createUserAvatar(req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("avatar/game/:id")
  async getUserAvatarBygameId(
    @UserSubject() user: User,
    @Param("id") gameId: string
  ) {
    return await this.avatarService.getUserAvatarByGameId(gameId, user);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("/avatar/other") // new
  async getUserAvatar(
    @Query("userId") userId: string,
    @Query("gameId") gameId: string
  ) {
    return await this.avatarService.getUserAvatar(userId, gameId);
  }

  @Put("/avatar/:id")
  async updateUserAvatar(
    @Param("id") avatarId: string,
    @Body() req: UpdateUserAvatarDto
  ) {
    return await this.avatarService.update(avatarId, req);
  }

  @Delete("/avatar/:id")
  async daleteUserAvatar(@Param("id") avatarId: string) {
    return await this.avatarService.deleteUserAvatar(avatarId);
  }
}
