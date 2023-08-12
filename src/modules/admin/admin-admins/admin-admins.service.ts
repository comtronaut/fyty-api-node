import { Injectable } from "@nestjs/common";
import { Admin } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { CreateAdminDto, UpdateAdminDto } from "model/dto/admin.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class AdminAdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(payload: CreateAdminDto): Promise<Admin> {
    const adminData = payload;
    const hashedPassword = await bcrypt.hash(payload.password, 12);
    adminData.password = hashedPassword;

    return await this.prisma.admin.create({
      data: adminData
    });
  }

  async getAllAdmin(): Promise<Admin[]> {
    return await this.prisma.admin.findMany();
  }

  async getAdminById(adminId: string): Promise<Admin> {
    return await this.prisma.admin.findUniqueOrThrow({
      where: {
        id: adminId
      }
    });
  }

  async updateAdminData(adminId: string, payload: UpdateAdminDto): Promise<Admin> {
    const adminData = payload;

    if (payload.password) {
      const hashedPassword = await bcrypt.hash(payload.password, 12);
      adminData.password = hashedPassword;
    }

    return await this.prisma.admin.update({
      where: {
        id: adminId
      },
      data: adminData
    });
  }

  async deleteAdmin(adminId: string): Promise<void> {
    await this.prisma.admin.delete({
      where: {
        id: adminId
      }
    });
  }
}
