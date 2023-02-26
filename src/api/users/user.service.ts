import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({ where: { id } });
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

      return userData;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(user: User, req: UpdateUserDto) {
    try {
      const { password, phoneNumber, ...updateData } = req;

      const updateRes = await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          ...updateData,
          ...(password && { password: bcrypt.hashSync(password, 12) })
        }
      });

      const res = await this.prisma.user.findUniqueOrThrow({
        where: { id: user.id }
      });

      const flatten = (userInfo: User) => {
        const { password, ...rest } = userInfo;
        return rest;
      };

      return flatten(res);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const res = await this.prisma.user.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getDuplicationResult(
    payload: UpdateUserDto
  ): Promise<Record<string, boolean>> {
    const res = {} as Record<string, boolean>;

    for (const [ key, value ] of Object.entries(payload)) {
      res[key] = Boolean(
        await this.prisma.user.findFirst({ where: { [key]: value } })
      );
    }

    return res;
  }
}
