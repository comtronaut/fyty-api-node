import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import dayjs from "dayjs";
import { UpdateRoomDto } from "src/model/dto/room.dto";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { RoomService } from "src/modules/room/room.service";

@Controller("admins/rooms")
export class AdminRoomsController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async getRooms() {
    return await this.roomService.getAll();
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get(":id")
  async getRoomsById(@Param("id") roomId: string) {
    return await this.roomService.getById(roomId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get(":id/participants")
  async getRoomParticipantsById(@Param("id") roomId: string) {
    return await this.roomService.getRoomMembersByRoomId(roomId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get(":id/roomlineup")
  async getRoomLineUpById(@Param("id") roomId: string) {
    return await this.roomService.getRoomLineupsByRoomId(roomId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Put(":id")
  async updateRoomsById(@Param("id") roomId: string, @Body() payload: UpdateRoomDto) {
    return await this.roomService.update(roomId, payload);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(":id")
  async deleteRoom(@Param("id") roomId: string) {
    const timestamp = dayjs().add(1000, "year").toDate();
    return await this.roomService.deleteMultiple(timestamp, [ roomId ]);
  }
}
