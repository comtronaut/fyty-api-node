import { Module } from "@nestjs/common";
import { RoomService } from "modules/room/room.service";
import { AdminRoomsController } from "./admin-rooms.controller";

@Module({
  controllers: [ AdminRoomsController ],
  providers: [ RoomService ]
})
export class AdminRoomsModule {}
