import { Module } from "@nestjs/common";
import { TeamService } from "modules/team/team.service";
import { AdminTeamsController } from "./admin-teams.controller";
import { RoomService } from "modules/room/room.service";

@Module({
  controllers: [ AdminTeamsController ],
  providers: [ TeamService, RoomService ]
})
export class AdminTeamsModule {}
