import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { User } from "@prisma/client";
import { UserSubject } from "src/common/subject.decorator";
import { CreateRoomPendingDto } from "src/model/dto/room-pending.dto";
import { DeleteRoomDto } from "src/model/dto/room.dto";
import { UserJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { ChatService } from "../chat/chat.service";
import { RoomPendingService } from "./pending.service";
import { RoomService } from "./room.service";

@Controller("rooms")
@UseGuards(UserJwtAuthGuard)
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly chatService: ChatService,
    private readonly roomPendingService: RoomPendingService
  ) {}

  @Get()
  async getRoomsBygame(
    @Query("gameId") gameId?: string,
    @Query("name") name?: string,
    @Query("date") date?: string
  ) {
    return await this.roomService.getByFilter({
      gameId,
      name,
      date
    });
  }

  @Get("teams/:id")
  async getHostedRooms(
    @Param("id") teamId: string,
    @Query("isJoined") isJoined?: string,
    @Query("isPending") isPending?: string,
    @Query("isHosted") isHosted?: string
  ) {
    return await this.roomService.getByTeamFilter(teamId, {
      isJoined: Boolean(isJoined),
      isHosted: Boolean(isHosted),
      isPending: Boolean(isPending)
    });
  }

  @Get(":id")
  async getRoomsById(@Param("id") roomId: string) {
    return await this.roomService.getById(roomId);
  }

  @Delete("disband")
  async deleteRoom(@Body() payload: DeleteRoomDto) {
    return await this.roomService.disband(payload);
  }

  // detail
  @Get(":id/detail")
  async getRoomDetail(@Param("id") roomId: string) {
    return await this.roomService.getRoomDetail(roomId);
  }

  // chat
  @Get(":id/chat")
  async getRoomChatWithMessages(@Param("id") roomId: string) {
    return await this.chatService.getChatWithMessagesByRoomId(roomId);
  }

  // pendings
  @Get(":id/pendings")
  async getRoomsPendings(@Param("id") roomId: string) {
    return await this.roomPendingService.getByRoomId(roomId);
  }

  @Post(":id/pendings")
  async createRoomPending(
    @Param("id") roomId: string,
    @Body() payload: CreateRoomPendingDto
  ) {
    return await this.roomPendingService.create(roomId, payload);
  }

  @Delete("pendings/:id")
  async deleteRoomPending(@Param("id") pendingId: string, @UserSubject() user: User) {
    return await this.roomPendingService.deleteById(pendingId, user.id);
  }
}
