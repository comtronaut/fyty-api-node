import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Cache } from "cache-manager";

import {
  CreateUserDto,
  SecureUserDto,
  UpdateUserDto,
  UserDetailResponseDto
} from "model/dto/user.dto";
import { ImageService } from "modules/image/image.service";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async getAllUser(): Promise<SecureUserDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...e }) => e);
  }

  async getByIds(ids: string[]): Promise<SecureUserDto[]> {
    const users = await this.prisma.user.findMany({ where: { id: { in: ids } } });
    return users.map(({ password, ...e }) => e);
  }

  async getById(id: string) {
    const cachedUser = await this.cacheManager.get<User>(`user:${id}`);

    if (cachedUser) {
      return cachedUser;
    }

    const { password, ...out } = await this.prisma.user.findUniqueOrThrow({
      where: { id }
    });

    await this.cacheManager.set(`user:${id}`, out);

    return out;
  }

  async getDetailById(id: string): Promise<UserDetailResponseDto> {
    const { password, settings, avatars, ...info }
      = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          settings: true,
          avatars: true
        }
      });

    return {
      info,
      settings,
      avatars
    };
  }

  async searchUsers(searchString: string, teamId?: string): Promise<SecureUserDto[]> {
    let gameId = null;
    if (teamId) {
      const { gameId: teamGameId } = await this.prisma.team.findUniqueOrThrow({
        where: { id: teamId },
        select: { gameId: true }
      });

      gameId = teamGameId;
    }

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            displayName: {
              contains: searchString,
              mode: "insensitive"
            }
          },
          {
            username: {
              contains: searchString,
              mode: "insensitive"
            }
          }
        ],
        ...(gameId && {
          teamMembers: {
            none: {
              team: {
                gameId
              }
            }
          }
        })
      },
      take: 10
    });

    return users.map(({ password, ...e }) => e);
  }

  async create(data: CreateUserDto): Promise<SecureUserDto> {
    const passwordHash = await bcrypt.hash(data.password, 12);
    const createdContent = { ...data, password: passwordHash };

    const { password, ...userData } = await this.prisma.user.create({
      data: {
        // FIXME: set verificaiton status to true for everyone for now
        isVerified: true,
        ...createdContent,
        settings: {
          create: {}
        }
      }
    });

    return userData;
  }

  async update(id: string, data: UpdateUserDto): Promise<SecureUserDto> {
    const oldUserData = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: { portraitUrl: true, coverUrl: true }
    });

    const { password, ...out } = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...data,
        ...(data.email && { updatedEmailAt: new Date() }),
        ...(data.mobilePhone && { updatedMobilePhoneAt: new Date() }),
        ...(data.username && { updatedUsernameAt: new Date() }),
        ...(data.password && {
          password: bcrypt.hashSync(data.password, 12)
        })
      }
    });

    const toBeRemovedImageUrls = this.imageService.compareUrls([
      [ oldUserData.portraitUrl, data.portraitUrl ],
      [ oldUserData.coverUrl, data.coverUrl ]
    ]);

    void this.imageService.deleteImageByIds(toBeRemovedImageUrls);

    await this.cacheManager.set(`user:${id}`, out);

    return out;
  }

  async delete(id: string): Promise<void> {
    await Promise.all([
      this.prisma.user.delete({ where: { id } }),
      this.cacheManager.del(`user:${id}`)
    ]);
  }

  async getDuplicationResult(data: UpdateUserDto): Promise<Record<string, boolean>> {
    const res = {} as Record<string, boolean>;

    for (const [ key, value ] of Object.entries(data)) {
      if (value) {
        const t = await this.prisma.user.findFirst({
          where: { [key]: value },
          select: { id: true }
        });
        res[key] = Boolean(t);
      }
    }

    return res;
  }
}
