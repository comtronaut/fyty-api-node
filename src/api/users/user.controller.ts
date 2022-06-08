import { Body, Controller, Get, Post, Param, Delete, Put, UseGuards } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";
import { Subject } from "src/common/subject.decorator";
import { UserService } from "./user.service";
import { User } from "src/model/sql-entity/user.entity";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async addUser(@Body() req: CreateUserDto) {
    return this.userService.createUser(req);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getSelf(
    @Subject() subject: User
  ) {
    return subject;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Subject() subject: User, 
    @Body() req: UpdateUserDto,
    ) {
    return await this.userService.updateUser(subject, req);
  }

  // @UseGuards()
  // @Delete(":id")
  // async deleteUser(@Param("id") id: string) {
    // await this.userService.deleteUser(id);

    // return `Delete user ${id} success`;
  // }
}
