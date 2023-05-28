import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { RoomService } from "modules/room/room.service";

import { RoutineService } from "./routine.service";
import { NotifyService } from "../notification/lineNotify.service";

@Module({
  imports: [ ScheduleModule.forRoot() ],
  controllers: [],
  providers: [ RoutineService, RoomService, NotifyService ]
})
export class RoutineModule {}
