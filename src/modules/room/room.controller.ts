import {
  BadRequestException,
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
import { User } from "@prisma/client";
import { UserSubject } from "common/subject.decorator";
import { CreateRoomPendingDto } from "model/dto/room-pending.dto";
import { DeleteRoomDto } from "model/dto/room.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { ChatService } from "../chat/chat.service";
import { RoomPendingService } from "./pending.service";
import { RoomService } from "./room.service";
import { LobbyService } from "./lobby.service";
import { UpdateRoomSettingDto } from "model/dto/room-settings.dto";

@Controller("rooms")
@UseGuards(UserJwtAuthGuard)
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly chatService: ChatService,
    private readonly roomPendingService: RoomPendingService,
    private readonly lobbyService: LobbyService
  ) {}

  @Get()
  async getRooms(
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

  // lobby
  @Get("lobby")
  async getRoomsLobby(
    @UserSubject() user: User,
    @Query("date") date: string,
    @Query("gameId") gameId: string
  ) {
    if (!date || !gameId) {
      throw new BadRequestException("date or gameId weren't supplied");
    }

    return await this.lobbyService.getLobbyByGameId(gameId, date, user);
  }

  // room
  @Get(":id")
  async getRoomById(@Param("id") roomId: string) {
    return await this.roomService.getById(roomId);
  }

  @Delete("disband")
  async deleteRoom(@Body() payload: DeleteRoomDto) {
    return await this.roomService.disband(payload);
  }

  // settings
  @Get(":id/settings")
  async getRoomSettingsByRoomId(@Param("id") roomId: string) {
    // TODO:
  }

  @Put("settings/:id")
  async putRoomSettings(@Param("id") roomId: string, payload: UpdateRoomSettingDto) {
    // TODO:
  }

  // detail
  @Get(":id/detail")
  async getRoomDetailById(@Param("id") roomId: string) {
    return await this.roomService.getRoomDetail(roomId);
  }

  // chat
  @Get(":id/chat")
  async getRoomChatWithMessages(@Param("id") roomId: string) {
    return await this.chatService.getChatWithMessagesByRoomId(roomId);
  }

  // pendings
  @Get(":id/pendings")
  async getRoomsPendingsByRoomId(@Param("id") roomId: string) {
    return await this.roomPendingService.getByRoomId(roomId);
  }

  @Post(":id/pendings")
  async postRoomPendingByRoomId(
    @Param("id") roomId: string,
    @Body() payload: CreateRoomPendingDto
  ) {
    return await this.roomPendingService.create(roomId, payload);
  }

  @Delete("pendings/:id")
  async deleteRoomPendingById(@Param("id") pendingId: string, @UserSubject() user: User) {
    return await this.roomPendingService.deleteById(pendingId, user.id);
  }
}
