import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UseGuards } from "@nestjs/common/decorators";
import { Admin } from "@prisma/client";

import { UserSubject } from "common/subject.decorator";
import { CreateAdminDto, UpdateAdminDto } from "model/dto/admin.dto";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

import { AdminAdminsService } from "./admin-admins.service";

@Controller("admin/admins")
@UseGuards(AdminJwtAuthGuard)
export class AdminAdminsController {
  constructor(private readonly adminService: AdminAdminsService) {}

  @Post()
  async createAdminAsAdmin(@Body() payload: CreateAdminDto) {
    return await this.adminService.createAdmin(payload);
  }

  @Get()
  async getAllAdminsAsAdmin() {
    return await this.adminService.getAllAdmin();
  }

  @Get("me")
  async getMeAdminInfo(@UserSubject() user: Admin) {
    return user;
  }

  @Get(":id")
  async getAdminByIdAsAdmin(@Param("id") id: string) {
    return await this.adminService.getAdminById(id);
  }

  @Put(":id")
  async updateAdminByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateAdminDto) {
    return await this.adminService.updateAdminData(id, payload);
  }

  @Delete(":id")
  async deleteAdminByIdAsAdmin(@Param("id") id: string) {
    return await this.adminService.deleteAdmin(id);
  }
}
