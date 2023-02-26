import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import env from "src/common/env.config";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async retrieveUserAccessToken(user: any) {
    try {
      const res = await this.prisma.user.findFirst({
        where: { email: user.email }
      });
      if (res !== null) {
        return this.getAccessToken(res.id);
      } else {
        return {
          requiredRegister: true,
          user
        };
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getUserByUsername(username: User["username"]): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({ where: { username } });
  }

  async getUserByEmail(email: User["email"]): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({ where: { email } });
  }

  async getUserById(id: User["id"]) {
    return await this.prisma.user.findFirstOrThrow({ where: { id } });
  }

  async localLogin(usernameOrEmail: string, password: string) {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          OR: [
            { username: usernameOrEmail },
            { email: usernameOrEmail }
          ]
        }
      });
      await this.validateLogin(user, password);

      return this.getAccessToken(user.id);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  private async validateLogin(user: User, inPassword: User["password"]) {
    if (user && bcrypt.compareSync(inPassword, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException("username or password is incorrect.");
  }

  private getAccessToken(id: User["id"]) {
    const payload = { sub: id };
    const accessToken = jwt.sign(payload, env.JWT_SECRET);

    return { accessToken };
  }
}
