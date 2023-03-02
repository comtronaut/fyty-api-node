import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable
} from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Cache } from "cache-manager";
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

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
    try {
      const [ hashedPassword, hashedPhoneNumber ] = await Promise.all([
        bcrypt.hash(data.password, 12),
        bcrypt.hash(data.phoneNumber, 12)
      ]);

      const { phoneNumber, ...rest } = data;
      const createdContent = { ...rest, password: hashedPassword };

      await this.prisma.phoneNumber.create({
        data: {
          phoneNumber: hashedPhoneNumber
        }
      });

      const { password, ...userData } = await this.prisma.user.create({
        data: createdContent
      });
      await this.prisma.userSettings.create({
        data: {
          userId: userData.id,
          lang: "th"
        }
      });

      return userData;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(user: User, data: UpdateUserDto) {
    try {
      const { phoneNumber, ...updateData } = data;

      const res = await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          ...updateData,
          ...(updateData.email && { updatedEmailAt: new Date() }),
          ...(updateData.username && { updatedUsernameAt: new Date() }),
          ...(updateData.password && {
            password: bcrypt.hashSync(updateData.password, 12)
          })
        }
      });

      await this.cacheManager.set(`user:${user.id}`, res);

      return res;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const res = await this.prisma.user.delete({ where: { id } });

      await this.cacheManager.del(`user:${id}`);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getDuplicationResult({
    phoneNumber,
    ...payload
  }: UpdateUserDto): Promise<Record<string, boolean>> {
    const res = {} as Record<string, boolean>;

    for (const [ key, value ] of Object.entries(payload)) {
      res[key] = Boolean(
        await this.prisma.user.findFirst({ where: { [key]: value } })
      );
    }

    if (phoneNumber) {
      const hashedPhoneNumber = bcrypt.hashSync(phoneNumber, 12);
      res[phoneNumber] = Boolean(
        await this.prisma.phoneNumber.findUnique({
          where: { phoneNumber: hashedPhoneNumber }
        })
      );
    }

    return res;
  }
}
