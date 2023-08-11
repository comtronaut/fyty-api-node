import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Admin, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import env from "common/env.config";
import { AdminAdminsService } from "modules/admin/admin-admins/admin-admins.service";
import { UserService } from "modules/user/services/user.service";
import { PrismaService } from "prisma/prisma.service";

import { FacebookInfo } from "./guard/facebook.guard";
import { GoogleInfo } from "./guard/google.guard";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly adminService: AdminAdminsService
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

  async getAdminById(adminId: string) {
    return await this.adminService.getAdminById(adminId);
  }

  async adminLogin(email: string, password: string) {
    const admin = await this.prisma.admin.findUniqueOrThrow({
      where: {
        email
      }
    });

    if (admin && bcrypt.compareSync(password, admin.password)) {
      const { password, ...adminData } = admin;
      const accessToken = this.getAdminAccessToken(adminData.id);
      return { ...adminData, ...accessToken };
    } else {
      throw new UnauthorizedException("email or password is incorrect.");
    }
  }

  async loginLocal(usernameOrEmail: string, password: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
      }
    });

    if (!this.isValidPassword(user, password)) {
      throw new UnauthorizedException("username or password is incorrect.");
    }

    await this.userService.update(user.id, {
      lastLoginAt: new Date(),
      ...(!user.firstLoginAt && { firstLoginAt: new Date() })
    });

    return this.getAccessToken(user.id);
  }

  private isValidPassword(user: User, inPassword: User["password"]) {
    return user && bcrypt.compareSync(inPassword, user.password);
  }

  private getAccessToken(id: string) {
    const payload = { sub: id };
    const accessToken = jwt.sign(payload, env.JWT_SECRET);

    return { accessToken };
  }

  private getAdminAccessToken(id: string) {
    const payload = { sub: id };
    const accessToken = jwt.sign(payload, env.JWT_ADMIN_SECRET);

    return { accessToken };
  }
}
