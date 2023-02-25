import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import env from "src/common/env.config";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByOAuth(user: any) {
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

  async localLogin(userName: string, password: string) {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: { username: userName }
      });
      await this.validateLogin(user, password);

      return this.getAccessToken(user.id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  private async validateLogin(user: User, password: User["password"]) {
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new BadRequestException("username or password is incorrect.");
  }

  private getAccessToken(id: User["id"]) {
    const payload = { sub: id };
    const accessToken = jwt.sign(payload, env.JWT_SECRET);

    return { accessToken };
  }
}
