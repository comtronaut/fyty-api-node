import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { User } from "@prisma/client";

import { UserSubject } from "common/subject.decorator";
import { CreateRoomPendingDto } from "model/dto/room-pending.dto";
import { UpdateRoomSettingDto } from "model/dto/room-settings.dto";
import { DeleteRoomDto } from "model/dto/room.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

import { LobbyService } from "./lobby.service";
import { RoomPendingService } from "./pending.service";
import { RoomService } from "./room.service";
import { ChatService } from "../chat/chat.service";

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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoom(@Body() payload: DeleteRoomDto): Promise<void> {
    await this.roomService.disband(payload);
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoomPendingById(
    @Param("id") pendingId: string,
    @UserSubject() user: User
  ): Promise<void> {
    return await this.roomPendingService.deleteById(pendingId, user.id);
  }
}
