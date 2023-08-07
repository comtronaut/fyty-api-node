import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { ImageService } from "modules/image/image.service";
import { RoomService } from "modules/room/room.service";

import { RoutineService } from "./routine.service";
import { LineNotifyService } from "../notification/line-notify.service";

@Module({
  imports: [ ScheduleModule.forRoot() ],
  controllers: [],
  providers: [ RoutineService, RoomService, LineNotifyService, ImageService ]
})
export class RoutineModule {}
