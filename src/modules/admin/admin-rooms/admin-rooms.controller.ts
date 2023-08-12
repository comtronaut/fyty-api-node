import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards
} from "@nestjs/common";

import { UpdateRoomDto } from "model/dto/room.dto";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { RoomService } from "modules/room/room.service";

@Controller("admin/rooms")
@UseGuards(AdminJwtAuthGuard)
export class AdminRoomsController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async getAllRoomsAsAdmin() {
    return await this.roomService.getByFilter({});
  }

  @Get(":id")
  async getRoomByIdAsAdmin(@Param("id") id: string) {
    return await this.roomService.getById(id);
  }

  @Get(":id/participants")
  async getRoomParticipantsByRoomIdAsAdmin(@Param("id") id: string) {
    return await this.roomService.getRoomMembersByRoomId(id);
  }

  @Get(":id/lineups")
  async getRoomLineupsByRoomIdAsAdmin(@Param("id") id: string) {
    return await this.roomService.getRoomLineupsByRoomId(id);
  }

  @Put(":id")
  async updateRoomsByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateRoomDto) {
    return await this.roomService.update(id, payload);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoomByIdAsAdmin(@Param("id") id: string): Promise<void> {
    return await this.roomService.deleteSingle(id, true);
  }
}
