import { BadRequestException, Injectable } from "@nestjs/common";
import { Lang } from "@prisma/client";

import { CreateUserSettingsDto, UpdateUserSettingsDto } from "src/model/dto/user-settings.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: string) {
    try {
      const userSettings = await this.prisma.userSettings.findUnique({
        where: { userId }
      });

      return userSettings ?? (await this.create({ userId, lang: Lang.TH }));
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(data: CreateUserSettingsDto) {
    try {
      return await this.prisma.userSettings.create({ data });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateByUserId(id: string, data: UpdateUserSettingsDto) {
    try {
      return await this.prisma.userSettings.update({
        where: { userId: id },
        data
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
