import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UserService } from "src/api/users/user.service";
import env from "src/common/env.config";
import { PrismaService } from "src/services/prisma.service";
import { FacebookInfo } from "./guard/facebook.guard";
import { GoogleInfo } from "./guard/google.guard";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async loginFacebook(user: FacebookInfo) {
    const dbUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: user.email }, { facebookId: user.id }]
      }
    });

    if (dbUser) {
      await this.prisma.user.update({
        where: { id: dbUser.id },
        data: {
          facebookId: user.id,
          lastLoginAt: new Date(),
          ...(!dbUser.firstLoginAt && { firstLoginAt: new Date() })
        }
      });

      return this.getAccessToken(dbUser.id);
    } else {
      return {
        requiredRegister: true,
        user: {
          displayName: user.name,
          portraitUrl: user.picture.data.url || "",
          email: user.email ?? null,
          facebookId: user.id
        } satisfies Partial<User>
      };
    }
  }

  async loginGoogle(user: GoogleInfo) {
    const dbUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: user.email }, { googleId: user.sub }]
      }
    });

    if (dbUser) {
      await this.prisma.user.update({
        where: { id: dbUser.id },
        data: {
          googleId: user.sub,
          lastLoginAt: new Date(),
          ...(!dbUser.firstLoginAt && { firstLoginAt: new Date() })
        }
      });

      return this.getAccessToken(dbUser.id);
    } else {
      return {
        requiredRegister: true,
        user: {
          displayName: user.name,
          portraitUrl: user.picture,
          email: user.email ?? null,
          googleId: user.sub
        } satisfies Partial<User>
      };
    }
  }

  async getUserById(id: string) {
    return await this.userService.getById(id);
  }

  async loginLocal(usernameOrEmail: string, password: string) {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        }
      });

      if (!this.isValidPassword(user, password)) {
        throw new UnauthorizedException("username or password is incorrect.");
      }

      await this.userService.update(user, {
        lastLoginAt: new Date(),
        ...(!user.firstLoginAt && { firstLoginAt: new Date() })
      });

      return this.getAccessToken(user.id);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  private isValidPassword(user: User, inPassword: User["password"]) {
    return user && bcrypt.compareSync(inPassword, user.password);
  }

  private getAccessToken(id: string) {
    const payload = { sub: id };
    const accessToken = jwt.sign(payload, env.JWT_SECRET);

    return { accessToken };
  }
}
