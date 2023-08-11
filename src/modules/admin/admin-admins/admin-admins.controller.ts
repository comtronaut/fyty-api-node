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
  async createAdminAccount(@Body() payload: CreateAdminDto) {
    return await this.adminService.createAdmin(payload);
  }

  @Get()
  async getAllAdmin() {
    return await this.adminService.getAllAdmin();
  }

  @Get("me")
  async getMeAdmin(@UserSubject() user: Admin) {
    return user;
  }

  @Get(":id")
  async getAdmin(@Param("id") adminId: string) {
    return await this.adminService.getAdminById(adminId);
  }

  @Put(":id")
  async updateAdminData(@Param("id") adminId: string, @Body() payload: UpdateAdminDto) {
    return await this.adminService.updateAdminData(adminId, payload);
  }

  @Delete(":id")
  async deleteAdmin(@Param("id") adminId: string) {
    return await this.adminService.deleteAdmin(adminId);
  }
}
