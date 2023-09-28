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
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly chatService: ChatService,
    private readonly roomPendingService: RoomPendingService,
    private readonly lobbyService: LobbyService
  ) {}

  @Get()
  @UseGuards(UserJwtAuthGuard)
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
  @UseGuards(UserJwtAuthGuard)
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
  async getRoomsLobby(@Query("date") date: string, @Query("gameId") gameId: string) {
    if (!date || !gameId) {
      throw new BadRequestException("date and gameId queries are required");
    }

    return await this.lobbyService.getLobby(gameId, date);
  }

  @Get("lobby/detail")
  @UseGuards(UserJwtAuthGuard)
  async getRoomsLobbyWithUserDetail(
    @Query("date") date: string,
    @Query("gameId") gameId: string,
    @UserSubject() user: User
  ) {
    if (!date || !gameId) {
      throw new BadRequestException("date and gameId queries are required");
    }

    return await this.lobbyService.getLobbyDetail(gameId, date, user);
  }

  // room
  @Get(":id")
  @UseGuards(UserJwtAuthGuard)
  async getRoomById(@Param("id") roomId: string) {
    return await this.roomService.getById(roomId);
  }

  @Delete("disband")
  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoom(@Body() payload: DeleteRoomDto): Promise<void> {
    await this.roomService.disband(payload);
  }

  // settings
  @Get(":id/settings")
  @UseGuards(UserJwtAuthGuard)
  async getRoomSettingsByRoomId(@Param("id") roomId: string) {
    // TODO:
  }

  @Put("settings/:id")
  @UseGuards(UserJwtAuthGuard)
  async putRoomSettings(@Param("id") roomId: string, payload: UpdateRoomSettingDto) {
    // TODO:
  }

  // noti registration
  @Get(":id/notif-registrations")
  @UseGuards(UserJwtAuthGuard)
  async getRoomRegistrationsByRoomId(@Param("id") roomId: string) {
    return await this.roomService.getRoomRegistrationsById(roomId);
  }

  // detail
  @Get(":id/detail")
  @UseGuards(UserJwtAuthGuard)
  async getRoomDetailById(@Param("id") roomId: string) {
    return await this.roomService.getRoomDetailById(roomId);
  }

  // chat
  @Get(":id/chat")
  @UseGuards(UserJwtAuthGuard)
  async getRoomChatDetailByRoomId(@Param("id") roomId: string) {
    return await this.chatService.getChatDetailByRoomId(roomId);
  }

  // pendings
  @Get(":id/pendings")
  @UseGuards(UserJwtAuthGuard)
  async getRoomsPendingsByRoomId(@Param("id") roomId: string) {
    return await this.roomPendingService.getByRoomId(roomId);
  }

  @Post(":id/pendings")
  @UseGuards(UserJwtAuthGuard)
  async postRoomPendingByRoomId(
    @Param("id") roomId: string,
    @Body() payload: CreateRoomPendingDto
  ) {
    return await this.roomPendingService.create(roomId, payload);
  }

  @Delete("pendings/:id")
  @UseGuards(UserJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoomPendingById(
    @Param("id") pendingId: string,
    @UserSubject() user: User
  ): Promise<void> {
    return await this.roomPendingService.deleteById(pendingId, user.id);
  }
}
