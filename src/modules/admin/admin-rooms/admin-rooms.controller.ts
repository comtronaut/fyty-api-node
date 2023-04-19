import { Body, Controller, Delete, Get, Param, Put, UseGuards } from "@nestjs/common";
import dayjs from "dayjs";
import { UpdateRoomDto } from "src/model/dto/room.dto";
import { AdminJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { RoomService } from "src/modules/room/room.service";

@Controller("admin/rooms")
@UseGuards(AdminJwtAuthGuard)
export class AdminRoomsController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getRooms() {
    return await this.roomService.getByFilter({});
  }

  @Get(":id")
  async getRoomsById(@Param("id") roomId: string) {
    return await this.roomService.getById(roomId);
  }

  @Get(":id/participants")
  async getRoomParticipantsById(@Param("id") roomId: string) {
    return await this.roomService.getRoomMembersByRoomId(roomId);
  }

  @Get(":id/roomlineup")
  async getRoomLineupById(@Param("id") roomId: string) {
    return await this.roomService.getRoomLineupsByRoomId(roomId);
  }

  @Put(":id")
  async updateRoomsById(@Param("id") roomId: string, @Body() payload: UpdateRoomDto) {
    return await this.roomService.update(roomId, payload);
  }

  @Delete(":id")
  async deleteRoom(@Param("id") roomId: string) {
    return await this.roomService.deleteSingle(roomId);
  }
}
