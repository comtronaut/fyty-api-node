import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";

import { CreateUserDto, UpdateUserDto } from "model/dto/user.dto";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { UserService } from "modules/user/services/user.service";

@Controller("admin/users")
@UseGuards(AdminJwtAuthGuard)
export class AdminUsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUserAsAdmin(@Body() payload: CreateUserDto) {
    return await this.userService.create(payload);
  }

  @Get()
  async getAllUsersAsAdmin() {
    return await this.userService.getAllUser();
  }

  @Get(":id")
  async getUserByIdAsAdmin(@Param("id") id: string) {
    return await this.userService.getById(id);
  }

  @Put(":id")
  async updateUserByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateUserDto) {
    return await this.userService.update(id, payload);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserByIdAsAdmin(@Param("id") id: string): Promise<void> {
    return await this.userService.deleteById(id);
  }
}
