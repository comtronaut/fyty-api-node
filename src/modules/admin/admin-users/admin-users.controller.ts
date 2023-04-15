import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards
} from "@nestjs/common";
import { User } from "@prisma/client";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { UpdateUserDto } from "src/model/dto/user.dto";
import { AdminUsersService } from "./admin-users.service";

@Controller("admins/api/users")
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @UseGuards(AdminJwtAuthGuard)
  async getAllUser() {
    return await this.adminUsersService.getAllUser();
  }

  @Get(":id")
  @UseGuards(AdminJwtAuthGuard)
  async getUser(@Param("id") userId: User["id"]) {
    return await this.adminUsersService.getUser(userId);
  }

  @Put(":id")
  @UseGuards(AdminJwtAuthGuard)
  async updateUser(
    @Param("id") userId: User["id"],
    @Body() payload: UpdateUserDto
  ) {
    return await this.adminUsersService.updateUserDetail(userId, payload);
  }

  // constraint
  @Delete(":id")
  @UseGuards(AdminJwtAuthGuard)
  async deleteUser(@Param("id") userId: User["id"]) {
    return await this.adminUsersService.deleteUser(userId);
  }
}
