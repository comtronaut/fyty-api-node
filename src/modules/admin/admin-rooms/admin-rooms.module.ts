import { Module } from "@nestjs/common";
import { RoomService } from "modules/room/room.service";
import { AdminRoomsController } from "./admin-rooms.controller";
import { NotifyService } from "src/modules/notification/lineNotify.service";

@Module({
  controllers: [ AdminRoomsController ],
  providers: [ RoomService, NotifyService ]
})
export class AdminRoomsModule {}
