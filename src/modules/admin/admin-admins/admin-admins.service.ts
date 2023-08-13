import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { CreateAdminDto, SecureAdminDto, UpdateAdminDto } from "model/dto/admin.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class AdminAdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(payload: CreateAdminDto): Promise<SecureAdminDto> {
    const hashedPassword = await bcrypt.hash(payload.password, 12);

    const { password, ...data } = await this.prisma.admin.create({
      data: {
        ...payload,
        password: hashedPassword
      }
    });

    return data;
  }

  async getAllAdmin(): Promise<SecureAdminDto[]> {
    const admins = await this.prisma.admin.findMany();

    return admins.map(({ password, ...data }) => data);
  }

  async getAdminById(adminId: string): Promise<SecureAdminDto> {
    const { password, ...data } = await this.prisma.admin.findUniqueOrThrow({
      where: { id: adminId }
    });

    return data;
  }

  async updateAdminData(adminId: string, payload: UpdateAdminDto): Promise<SecureAdminDto> {
    const adminData = payload;

    if (payload.password) {
      const hashedPassword = await bcrypt.hash(payload.password, 12);
      adminData.password = hashedPassword;
    }

    const { password, ...data } = await this.prisma.admin.update({
      where: {
        id: adminId
      },
      data: adminData
    });

    return data;
  }

  async deleteAdmin(adminId: string): Promise<void> {
    await this.prisma.admin.delete({
      where: { id: adminId }
    });
  }
}
