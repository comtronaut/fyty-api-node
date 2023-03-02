import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import {
  CreatePasswordResetSessionDto,
  UpdatePasswordResetSessionDto
} from "src/model/dto/password-reset-session.dto";
import * as bcrypt from "bcrypt";

import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class PasswordResetSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async get(where: Prisma.PasswordResetSessionWhereUniqueInput) {
    try {
      return await this.prisma.passwordResetSession.findUniqueOrThrow({
        where
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async resetToken(token: string, password: string) {
    try {
      const session = await this.prisma.passwordResetSession.findUniqueOrThrow({
        where: { token }
      });
      const hashedPassword = bcrypt.hashSync(password, 12);
      const updatedUser = await this.prisma.user.update({
        where: { id: session.userId },
        data: { password: hashedPassword }
      });
      await this.delete(session.id);

      return updatedUser;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async createByUserEmail(email: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email }
      });

      const token = bcrypt.hashSync(
        [ "password-reset-session", user.id, dayjs().toISOString() ].join(":"),
        12
      );

      const session = await this.create({
        userId: user.id,
        token,
        expiredAt: dayjs().add(1, "h").toDate()
      });

      return session;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(data: CreatePasswordResetSessionDto) {
    try {
      return await this.prisma.passwordResetSession.create({ data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, data: UpdatePasswordResetSessionDto) {
    try {
      return await this.prisma.passwordResetSession.update({
        where: { id },
        data
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.passwordResetSession.delete({
        where: { id }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
