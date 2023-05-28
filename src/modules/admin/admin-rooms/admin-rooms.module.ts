import { Module } from "@nestjs/common";

import { NotifyService } from "modules/notification/lineNotify.service";
import { RoomService } from "modules/room/room.service";

import { AdminRoomsController } from "./admin-rooms.controller";

@Module({
  controllers: [ AdminRoomsController ],
  providers: [ RoomService, NotifyService ]
})
export class AdminRoomsModule {}
