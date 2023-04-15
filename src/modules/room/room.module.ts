import { Module } from "@nestjs/common";
import { ChatModule } from "../chat/chat.module";
import { ChatService } from "../chat/chat.service";
import { TeamService } from "../team/team.service";
import { RoomParticipantService } from "./participant.service";
import { RoomController } from "./room.controller";
import { RoomGateway } from "./room.gateway";
import { RoomService } from "./room.service";
import { RoomNoteService } from "./note.service";
import { RoomRequestService } from "./request.service";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";
import { NotifyService } from "../notification/lineNotify.service";

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
