import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";
import { Subject } from "src/common/subject.decorator";
import { User } from "src/model/sql-entity/user.entity";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UserAvatarService } from "./avatar.service";

@Controller("api/users/avatars")
export class UserAvatarController {
  constructor(private readonly avatarService: UserAvatarService) { }

  // @Post()
  // async addUser(@Body() req: CreateUserDto) {
  //   return this.avatarService.createUser(req);
  // }

  // @Get("me")
  // @UseGuards(JwtAuthGuard)
  // async getSelf(
  //   @Subject() subject: User
  // ) {
  //   return subject;
  // }

  // @Put()
  // @UseGuards(JwtAuthGuard)
  // async updateUser(
  //   @Subject() subject: User, 
  //   @Body() req: UpdateUserDto,
  //   ) {
  //   return await this.avatarService.updateUser(subject, req);
  // }

  // @UseGuards()
  // @Delete(":id")
  // async deleteUser(@Param("id") id: string) {
    // await this.avatarService.deleteUser(id);

    // return `Delete user ${id} success`;
  // }
}
