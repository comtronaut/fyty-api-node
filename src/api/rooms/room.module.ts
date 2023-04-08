import { Module } from "@nestjs/common";
import { ChatModule } from "../chats/chat.module";
import { ChatService } from "../chats/chat.service";
import { TeamService } from "../teams/team.service";
import { RoomParticipantService } from "./participants/participant.service";
import { RoomController } from "./room.controller";
import { RoomGateway } from "./room.gateway";
import { RoomService } from "./room.service";
import { RoomNoteService } from "./note/note.service";
import { RoomRequestService } from "./request/request.service";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaService } from "src/services/prisma.service";
import { NotifyService } from "../line_notify/lineNotify.service";

@Module({
  imports: [ ChatModule, ScheduleModule.forRoot() ],
  controllers: [ RoomController ],
  providers: [
    RoomService,
    RoomGateway,
    ChatService,
    TeamService,
    RoomNoteService,
    RoomParticipantService,
    RoomRequestService,
    PrismaService,
    NotifyService
  ]
})
export class RoomModule {}
