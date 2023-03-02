import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import env from "src/common/env.config";
import { PrismaService } from "src/services/prisma.service";
import { UserService } from "src/api/users/user.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: "10800s" }
    })
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, JwtStrategy, UserService, PrismaService ]
})
export class AuthModule {}
