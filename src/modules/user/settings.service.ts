import { Injectable } from "@nestjs/common";
import { Lang } from "@prisma/client";

import { CreateUserSettingsDto, UpdateUserSettingsDto } from "model/dto/user-settings.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UserSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: string) {
    const userSettings = await this.prisma.userSettings.findUnique({
      where: { userId }
    });

    return userSettings ?? (await this.create({ userId, lang: Lang.TH }));
  }

  async create(data: CreateUserSettingsDto) {
    return await this.prisma.userSettings.create({ data });
  }

  async updateByUserId(id: string, data: UpdateUserSettingsDto) {
    return await this.prisma.userSettings.update({
      where: { userId: id },
      data
    });
  }
}
