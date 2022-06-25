import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";
import { Subject } from "src/common/subject.decorator";
import { UserService } from "./user.service";
import { User } from "src/model/sql-entity/user.entity";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) { }

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
}
