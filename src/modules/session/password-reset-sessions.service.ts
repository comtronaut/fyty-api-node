import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import dayjs from "dayjs";

import {
  CreatePasswordResetSessionDto,
  UpdatePasswordResetSessionDto
} from "model/dto/password-reset-session.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class PasswordResetSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async get(where: Prisma.PasswordResetSessionWhereUniqueInput) {
    return await this.prisma.passwordResetSession.findUniqueOrThrow({
      where
    });
  }

  async resetToken(token: string, password: string) {
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
  }

  async createByUserEmail(email: string) {
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
  }

  async create(data: CreatePasswordResetSessionDto) {
    return await this.prisma.passwordResetSession.create({ data });
  }

  async update(id: string, data: UpdatePasswordResetSessionDto) {
    return await this.prisma.passwordResetSession.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return await this.prisma.passwordResetSession.delete({
      where: { id }
    });
  }
}
