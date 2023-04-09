import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/prisma.service";
import { AdminRoomsController } from "./admin-rooms.controller";
import { AdminRoomsService } from "./admin-rooms.service";

@Module({
  controllers: [ AdminRoomsController ],
  providers: [ AdminRoomsService, PrismaService ]
})
export class AdminRoomrsModule {}
