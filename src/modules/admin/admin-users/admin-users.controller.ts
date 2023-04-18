import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UpdateUserDto } from "src/model/dto/user.dto";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { UserService } from "src/modules/user/user.service";

@Controller("admins/users")
@UseGuards(AdminJwtAuthGuard)
export class AdminUsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUser() {
    return await this.userService.getAllUser();
  }

  @Get(":id")
  async getUser(@Param("id") userId: User["id"]) {
    return await this.userService.getById(userId);
  }

  @Put(":id")
  async updateUser(@Param("id") userId: User["id"], @Body() payload: UpdateUserDto) {
    return await this.userService.update(userId, payload);
  }

  // constraint
  @Delete(":id")
  async deleteUser(@Param("id") userId: User["id"]) {
    return await this.userService.delete(userId);
  }
}
