import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/model/sql-entity/chat.entity";
import { LineUp } from "src/model/sql-entity/team/lineUp.entity";
import { Message } from "src/model/sql-entity/message.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { Room } from "src/model/sql-entity/room/room.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { User } from "src/model/sql-entity/user/user.entity";
import { SelectorController } from "./selector.controller";
import { SelectorService } from "./selector.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([ Team, LineUp, User, Room, RoomParticipant, Message, Chat ])
  ],
  controllers: [ SelectorController ],
  providers: [ SelectorService ]
})
export class SelectorModule { }
