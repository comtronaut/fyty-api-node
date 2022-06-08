import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhoneNumber } from "src/model/sql-entity/phoneNumber.entity";
import { User } from "src/model/sql-entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, PhoneNumber ])
  ],
  controllers: [ UserController ],
  providers: [ UserService ]
})
export class UserModule { }
