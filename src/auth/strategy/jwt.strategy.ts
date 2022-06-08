import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import env from "../../common/env.config";
import type { JwtPayload } from "jsonwebtoken";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
