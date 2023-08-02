import { Module } from "@nestjs/common";

import { LineNotifyService } from "modules/notification/line-notify.service";
import { RoomService } from "modules/room/room.service";

import { AdminRoomsController } from "./admin-rooms.controller";

@Module({
  controllers: [ AdminRoomsController ],
  providers: [ RoomService, LineNotifyService ]
})
export class AdminRoomsModule {}
