import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { AdminJwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { CreateRoomDto, UpdateRoomDto } from "src/model/dto/room/room.dto";
import { AdminRoomsService } from "./admin-rooms.service";

@Controller("admins/api/rooms")
export class AdminRoomsController {
  constructor(private readonly roomService: AdminRoomsService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async getRooms() {
    return await this.roomService.getAllRooms();
  }

  // CRUD
  // @UseGuards(AdminJwtAuthGuard)
  // @Post()
  // async createRoom(@Body() req: CreateRoomDto) {
  //   return await this.roomService.create(req);
  // }

  @UseGuards(AdminJwtAuthGuard)
  @Get("/:id")
  async getRoomsById(@Param("id") roomId: string) {
    return await this.roomService.getRoom(roomId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get("/:id/participants")
  async getRoomParticipantsById(@Param("id") roomId: string) {
    return await this.roomService.getRoomParticipants(roomId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get("/:id/roomlineup")
  async getRoomLineUpById(@Param("id") roomId: string) {
    return await this.roomService.getRoomLineUp(roomId);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Put("/:id")
  async updateRoomsById(
    @Param("id") roomId: string,
    @Body() payload: UpdateRoomDto
  ) {
    return await this.roomService.update(roomId, payload);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete("/:id")
  async deleteRoom(@Param("id") roomId: string) {
    return await this.roomService.delete(roomId);
  }
}
