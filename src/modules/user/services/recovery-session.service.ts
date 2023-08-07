import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import dayjs from "dayjs";

import {
  CreateUserRecoverySessionDto,
  UpdateUserRecoverySessionDto
} from "model/dto/password-reset-session.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UserRecoverySessionService {
  constructor(private readonly prisma: PrismaService) {}

  async get(where: Prisma.UserRecoverySessionWhereUniqueInput) {
    return await this.prisma.userRecoverySession.findUniqueOrThrow({
      where
    });
  }

  async resetToken(token: string, password: string) {
    const session = await this.prisma.userRecoverySession.findUniqueOrThrow({
      where: { token }
    });
    const hashedPassword = bcrypt.hashSync(password, 12);
    const updatedUser = await this.prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword }
    });
    await this.deleteById(session.id);

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

  async create(data: CreateUserRecoverySessionDto) {
    return await this.prisma.userRecoverySession.create({ data });
  }

  async update(id: string, data: UpdateUserRecoverySessionDto) {
    return await this.prisma.userRecoverySession.update({
      where: { id },
      data
    });
  }

  async deleteById(id: string) {
    return await this.prisma.userRecoverySession.delete({
      where: { id }
    });
  }
}
