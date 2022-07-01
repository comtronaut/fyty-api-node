import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LineUp } from "src/model/sql-entity/lineUp.entity";
import { RoomParticipant } from "src/model/sql-entity/participant.entity";
import { Room } from "src/model/sql-entity/room.entity";
import { Team } from "src/model/sql-entity/team.entity";
import { User } from "src/model/sql-entity/user.entity";
import { SelectorController } from "./selector.controller";
import { SelectorService } from "./selector.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([ Team, LineUp, User, Room, RoomParticipant  ])
  ],
  controllers: [ SelectorController ],
  providers: [ SelectorService ]
})
export class SelectorModule { }
