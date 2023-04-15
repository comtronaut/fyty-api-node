import { Injectable } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";
import { Admin } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { CreateAdminDto, UpdateAdminDto } from "src/model/dto/admin.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdmin(payload: CreateAdminDto) {
    try {
      const adminData = payload;
      const hashedPassword = await bcrypt.hash(payload.password, 12);
      adminData.password = hashedPassword;

      return await this.prisma.admin.create({
        data: adminData
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllAdmin() {
    try {
      return await this.prisma.admin.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAdminById(adminId: Admin["id"]) {
    try {
      return await this.prisma.admin.findUniqueOrThrow({
        where: {
          id: adminId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateAdminData(adminId: Admin["id"], payload: UpdateAdminDto) {
    try {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteAdmin(adminId: Admin["id"]) {
    try {
      return await this.prisma.admin.delete({
        where: {
          id: adminId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
