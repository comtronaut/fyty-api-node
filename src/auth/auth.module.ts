import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import nonNull from "non-null";
import { User } from "src/model/sql-entity/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import env from "src/common/env.config";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      // signOptions: { expiresIn: "60s" }
    }),
    TypeOrmModule.forFeature([ User ])
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, JwtStrategy ]
})
export class AuthModule {}
