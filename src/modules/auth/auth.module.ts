import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AdminService } from "src/modules/admin/admin-admins/admin-admins-service";
import { UserService } from "src/modules/user/user.service";
import env from "src/common/env.config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy, JwtStrategyAdmin } from "./strategy/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: "10800s" }
    })
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, JwtStrategy, JwtStrategyAdmin, UserService, AdminService ]
})
export class AuthModule {}
