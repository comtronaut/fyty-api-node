import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import {
  CreateUserAvatarDto,
  UpdateUserAvatarDto
} from "src/model/dto/user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserAvatarService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserAvatar(req: CreateUserAvatarDto) {
    try {
      return await this.prisma.userAvatar.create({ data: req });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getUserAvatar(userId: string, gameId: string) {
    try {
      return await this.prisma.userAvatar.findMany({
        where: { gameId, userId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getUserAvatarByGameId(gameId: string, user: User) {
    return await this.prisma.userAvatar.findMany({
      where: { gameId, userId: user.id }
    });
  }

  async update(avatarId: string, req: UpdateUserAvatarDto) {
    try {
      const updateRes = await this.prisma.userAvatar.update({
        where: {
          id: avatarId
        },
        data: req
      });

      return await this.prisma.userAvatar.findUniqueOrThrow({
        where: { id: avatarId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteUserAvatar(avatarId: string) {
    try {
      return await this.prisma.userAvatar.delete({ where: { id: avatarId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
