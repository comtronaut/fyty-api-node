import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";

import env from "common/env.config";

import { AuthService } from "../auth.service";

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, "jwt-admin") {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: env.JWT_ADMIN_SECRET
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException("invalid token format");
    }

    const admin = await this.authService.getAdminById(payload.sub);
    if (!admin || admin.role !== "MANAGEMENT") {
      throw new UnauthorizedException("Your are not admin.");
    }
    return admin;
  }
}

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, "jwt-user") {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: env.JWT_SECRET
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException("invalid token format");
    }

    return await this.authService.getUserById(payload.sub);
  }
}
