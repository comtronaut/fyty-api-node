import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Lang, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Cache } from "cache-manager";
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async getAllUser() {
    return await this.prisma.user.findMany();
  }

  async getById(id: string): Promise<User> {
    const cachedUser = await this.cacheManager.get<User>(`user:${id}`);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });

    await this.cacheManager.set(`user:${id}`, user);

    return user;
  }

  async searchUsers(searchString: string, teamId?: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        OR: [
          {
            displayName: {
              contains: searchString
            }
          },
          {
            username: {
              contains: searchString
            }
          }
        ]
      }
    });
  }

  async create(data: CreateUserDto) {
    const [ passwordHash ] = await Promise.all([ bcrypt.hash(data.password, 12) ]);

    const createdContent = { ...data, password: passwordHash };

    const { password, ...userData } = await this.prisma.user.create({
      data: {
        ...createdContent,
        settings: {
          create: {
            lang: Lang.TH
          }
        }
      }
    });

    return userData;
  }

  async update(id: string, data: UpdateUserDto) {
    const res = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...data,
        ...(data.email && { updatedEmailAt: new Date() }),
        ...(data.username && { updatedUsernameAt: new Date() }),
        ...(data.password && {
          password: bcrypt.hashSync(data.password, 12)
        })
      }
    });

    await this.cacheManager.set(`user:${id}`, res);

    return res;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });

    await this.cacheManager.del(`user:${id}`);
  }

  async getDuplicationResult(data: UpdateUserDto): Promise<Record<string, boolean>> {
    const res = {} as Record<string, boolean>;

    for (const [ key, value ] of Object.entries(data)) {
      res[key] = Boolean(await this.prisma.user.findFirst({ where: { [key]: value } }));
    }

    return res;
  }
}
