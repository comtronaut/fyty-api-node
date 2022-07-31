import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat } from "src/model/sql-entity/chat.entity";
import { Game } from "src/model/sql-entity/game.entity";
import { RoomNote } from "src/model/sql-entity/room/note.entity";
import { RoomParticipant } from "src/model/sql-entity/room/participant.entity";
import { Room } from "src/model/sql-entity/room/room.entity";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";
import { Team } from "src/model/sql-entity/team/team.entity";
import { ChatModule } from "../chats/chat.module";
import { ChatService } from "../chats/chat.service";
import { TeamService } from "../teams/team.service";
import { RoomParticipantService } from "./participants/participant.service";
import { RoomController } from "./room.controller";
import { RoomGateway } from "./room.gateway";
import { RoomService } from "./room.service";
import { RoomNoteService } from "./note/note.service";
import { RoomRequest } from "src/model/sql-entity/room/request.entity";
import { RoomLineup, RoomLineupBoard } from "src/model/sql-entity/room/Lineup.entity";
import { RoomRequestService } from "./request/request.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Room, RoomParticipant, Chat, Team, TeamMember, Game, RoomNote, RoomRequest, RoomLineup, RoomLineupBoard ]),
    ChatModule
  ],
  controllers: [ RoomController ],
  providers: [ RoomService, RoomGateway, ChatService, TeamService, RoomNoteService, RoomParticipantService, RoomRequestService ]
})
export class RoomModule { }
