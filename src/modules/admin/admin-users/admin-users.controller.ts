import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UpdateUserDto } from "src/model/dto/user.dto";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { UserService } from "src/modules/user/user.service";

@Controller("admins/users")
export class AdminUsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AdminJwtAuthGuard)
  async getAllUser() {
    return await this.userService.getAllUser();
  }

  @Get(":id")
  @UseGuards(AdminJwtAuthGuard)
  async getUser(@Param("id") userId: User["id"]) {
    return await this.userService.getById(userId);
  }

  @Put(":id")
  @UseGuards(AdminJwtAuthGuard)
  async updateUser(@Param("id") userId: User["id"], @Body() payload: UpdateUserDto) {
    return await this.userService.update(userId, payload);
  }

  // constraint
  @Delete(":id")
  @UseGuards(AdminJwtAuthGuard)
  async deleteUser(@Param("id") userId: User["id"]) {
    return await this.userService.delete(userId);
  }
}
