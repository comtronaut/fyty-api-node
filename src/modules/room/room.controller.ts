import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserSubject } from "src/common/subject.decorator";
import { CreateRoomPendingDto } from "src/model/dto/room-pending.dto";
import { DeleteRoomDto } from "src/model/dto/room.dto";
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { ChatService } from "../chat/chat.service";
import { RoomPendingService } from "./pending.service";
import { RoomService } from "./room.service";

@Controller("rooms")
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly chatService: ChatService,
    private readonly roomPendingService: RoomPendingService
  ) {}

  @UseGuards(UserJwtAuthGuard)
  @Get("game/:id")
  async getRoomsBygame(
    @Param("id") gameId: string,
    @Query("name") roomName?: string,
    @Query("date") date?: string
  ) {
    return await this.roomService.getAllRooms(gameId, roomName, date);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("team/:id")
  async getHostedRooms(@Param("id") teamId: string) {
    return await this.roomService.getRoomByHostId(teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get(":id")
  async getRoomsById(@Param("id") roomId: string) {
    return await this.roomService.getRoomsById(roomId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("me/team/:id")
  async getJoinedRooms(@Param("id") teamId: string) {
    return await this.roomService.getRoomsByTeamId(teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete("disband")
  async deleteRoom(@Body() payload: DeleteRoomDto) {
    return await this.roomService.disband(payload);
  }

  // detail
  @UseGuards(UserJwtAuthGuard)
  @Get(":id/detail")
  async getRoomDetail(@Param("id") roomId: string) {
    return await this.roomService.getRoomDetail(roomId);
  }

  // chat
  @UseGuards(UserJwtAuthGuard)
  @Get(":id/chat")
  async getRoomChatWithMessages(@Param("id") roomId: string) {
    return await this.chatService.getChatWithMessagesByRoomId(roomId);
  }

  // room request
  @UseGuards(UserJwtAuthGuard)
  @Get(":id/request")
  async getRoomsRequest(@Param("id") roomId: string) {
    return await this.roomPendingService.getByRoomId(roomId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("request/team/:id")
  async getRoomsRequestByTeam(@Param("id") teamId: string) {
    return await this.roomPendingService.getByTeamId(teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Post(":id/request")
  async createRoomRequest(@Param("id") roomId: string, @Body() payload: CreateRoomPendingDto) {
    return await this.roomPendingService.create(roomId, payload);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete("request/:id")
  async deleteRoomRequest(@Param("id") requestId: string, @UserSubject() user: User) {
    return await this.roomPendingService.deleteById(requestId, user.id);
  }
}
