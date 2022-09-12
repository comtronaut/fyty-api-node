import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";
import { Subject } from "src/common/subject.decorator";
import { UserService } from "./user.service";
import { User } from "src/model/sql-entity/user/user.entity";
import { CreateUserAvatarDto,UpdateUserAvatarDto } from "src/model/dto/user.dto";
import { UserAvatarService } from "./user-avatars/avatar.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";

@Controller("api/users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: UserAvatarService) { }

  @Post()
  async addUser(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Query("q") q: string,
    @Query("teamId") teamId: string,
    @Subject() subject: User
  ) {
    return await this.userService.searchUsers(q, teamId);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getSelf(
    @Subject() subject: User
  ) {
    return subject;
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getById(
    @Subject() subject: User,
    @Param("id") id: string
  ) {
    return await this.userService.getUserById(id);
  }

  @Get("/validation")
  async validateUserDuplication(
    @Query("username") username?: string,
    @Query("email") email?: string
  ) {
    return this.userService.validate(username, email);
  }

  @Put("me")
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Subject() subject: User,
    @Body() req: UpdateUserDto
  ) {
    return await this.userService.update(subject, req);
  }

  @Put("me/password")
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Subject() subject: User,
    @Body() password: string
  ) {
    return await this.userService.updatePassword(subject, password);
  }

  @Debug()
  @UseGuards(JwtAuthGuard)
  @Delete("me")
  async deleteUser(
    @Subject() subject: User
  ) {
    await this.userService.delete(subject.id);

    return `Delete user ${subject.username} success`;
  }

  // UserAvatar
  @Post("avatar")
  async createUserAvatar(
    @Body() req: CreateUserAvatarDto) {
    return this.avatarService.createUserAvatar(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get("avatar/game/:id")
  async getUserAvatarBygameId(
    @Subject() user: User,
    @Param("id") gameId: string) {
      console.log(gameId);
    return this.avatarService.getUserAvatarByGameId(gameId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/avatar/other")           // new
  async getUserAvatar(
    @Query("userId") userId: string,
    @Query("gameId") gameId: string) {
    return this.avatarService.getUserAvatar(userId, gameId);
  }

  @Put("/avatar/:id")
  async updateUserAvatar(
    @Param("id") avatarId: string,
    @Body() req: UpdateUserAvatarDto) {
    return this.avatarService.update(avatarId, req);
  }

  @Delete("/avatar/:id")
  async daleteUserAvatar(
    @Param("id") avatarId: string) {
    return this.avatarService.deleteUserAvatar(avatarId);
  }
}
