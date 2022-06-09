import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomParticipant } from "src/model/sql-entity/participant.entity";
import { Room } from "src/model/sql-entity/room.entity";
import { RoomParticipantService } from "./participants/room-participant.service";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Room, RoomParticipant ])
  ],
  controllers: [ RoomController ],
  providers: [ RoomService, RoomParticipantService ]
})
export class RoomModule { }
