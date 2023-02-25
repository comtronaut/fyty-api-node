import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/model/sql-entity/user/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import env from "src/common/env.config";
import { FacebookStrategy } from "./strategy/facebook.strategy";
import { GoogleStrategy } from "./strategy/google.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: "10800s" }
    }),
    TypeOrmModule.forFeature([ User ])
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, JwtStrategy, FacebookStrategy, GoogleStrategy ]
})
export class AuthModule {}
