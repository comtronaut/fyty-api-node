import { Injectable } from "@nestjs/common";
import { UserAvatar } from "@prisma/client";

import { CreateUserAvatarDto, UpdateUserAvatarDto } from "model/dto/user-avatar.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UserAvatarService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserAvatarDto): Promise<UserAvatar> {
    return await this.prisma.userAvatar.create({ data });
  }

  async getFilter(userId: string, gameId?: string): Promise<UserAvatar[]> {
    return await this.prisma.userAvatar.findMany({
      where: { gameId, userId }
    });
  }

  async update(avatarId: string, data: UpdateUserAvatarDto): Promise<UserAvatar> {
    return await this.prisma.userAvatar.update({
      where: {
        id: avatarId
      },
      data
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.userAvatar.delete({ where: { id } });
  }
}
