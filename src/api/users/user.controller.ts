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
  async addUser(@Body() user: CreateUserDto){
    const newUser = await this.userService.create(user);
    return newUser;
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getSelf(
    @Subject() subject: User
  ) {
    return subject;
  }

  @Get("/validation")
  async validateUser(
    @Query("username") username: string,
    @Query("email") email: string,
    @Query("password") password: string,
  ) {
    return this.userService.validation(username, email, password);
  }

  @Put("me")
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Subject() subject: User, 
    @Body() req: UpdateUserDto,
    ) {
    return await this.userService.update(subject, req);
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

  //UserAvatar
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
    return this.avatarService.getUserAvatar(gameId,user);
  }

  @Put("/avatar/:id")
  async updateUserAvatar(
    @Param("id") avatarId: string,
    @Body() req: UpdateUserAvatarDto,) {
    return this.avatarService.update(avatarId, req);
  }

  @Delete("/avatar/:id")
  async daleteUserAvatar(
    @Param("id") avatarId: string,) {
    return this.avatarService.deleteUserAvatar(avatarId);
  }

}
