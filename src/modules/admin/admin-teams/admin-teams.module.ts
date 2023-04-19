import { Module } from "@nestjs/common";
import { TeamService } from "src/modules/team/team.service";
import { AdminTeamsController } from "./admin-teams.controller";
import { RoomService } from "src/modules/room/room.service";

@Module({
  controllers: [ AdminTeamsController ],
  providers: [ TeamService, RoomService ]
})
export class AdminTeamsModule {}
