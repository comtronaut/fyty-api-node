import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "src/model/dto/user.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUser() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUser(userId: User["id"]) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUserDetail(userId: User["id"], payload: UpdateUserDto) {
    try {
      if (payload.password) {
        const hashedPassword = await bcrypt.hash(payload.password, 12);
        payload.password = hashedPassword;
      }
      if (payload.phoneNumber) {
        const hashedPhoneNumber = await bcrypt.hash(payload.phoneNumber, 12);
        payload.phoneNumber = hashedPhoneNumber;
      }

      return await this.prisma.user.update({
        where: {
          id: userId
        },
        data: payload
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(userId: User["id"]) {
    try {
      return await this.prisma.user.delete({
        where: {
          id: userId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
