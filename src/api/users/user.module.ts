import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhoneNumber } from "src/model/sql-entity/phoneNumber.entity";
import { User } from "src/model/sql-entity/user/user.entity";
import { UserAvatar } from "src/model/sql-entity/user/userAvatar.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserAvatarService } from "./user-avatars/avatar.service";

@Module({
  imports: [ TypeOrmModule.forFeature([ User, PhoneNumber, UserAvatar ]) ],
  controllers: [ UserController ],
  providers: [ UserService, UserAvatarService ]
})
export class UserModule {}
