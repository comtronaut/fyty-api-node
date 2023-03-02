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
import { User } from "@prisma/client";
import { UserJwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";
import { UserSubject } from "src/common/subject.decorator";
import { CreateRoomRequestDto } from "src/model/dto/room/request.dto";
import {
  CreateRoomDto,
  CreateRoomNoteDto,
  DeleteRoomDto,
  UpdateRoomNoteDto
} from "src/model/dto/room/room.dto";
import { RoomNoteService } from "./note/note.service";
import { RoomRequestService } from "./request/request.service";
import { RoomService } from "./room.service";

@Controller("api/rooms")
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomNoteService: RoomNoteService,
    private readonly roomRequestService: RoomRequestService
  ) {}

  @Debug() // only on test
  @UseGuards(UserJwtAuthGuard)
  @Post()
  async createRoom(@Body() req: CreateRoomDto) {
    return await this.roomService.create(req);
  }

  @UseGuards(UserJwtAuthGuard)
  @Post("/join")
  async joinRoom(
    @Query("teamId") teamId: string,
    @Query("roomId") roomId: string
  ) {
    return await this.roomService.joinRoom(teamId, roomId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("/game/:id")
  async getRoomsBygame(
    @Param("id") gameId: string,
    @Query("name") roomName?: string,
    @Query("date") date?: any
  ) {
    return await this.roomService.getAllRooms(gameId, roomName, date);
  }

  @UseGuards(UserJwtAuthGuard) // get all rooms which u r host
  @Get("/team/:id")
  async getHostedRooms(@Param("id") teamId: string) {
    return await this.roomService.getRoomByHostId(teamId);
  }

  @UseGuards(UserJwtAuthGuard) // get all rooms which u r host
  @Get("/me/game/:id")
  async getTodayRooms(
    @Param("id") gameId: string,
    @Query("date") date: string
  ) {
    return this.roomService.getRoomsByDate(date, gameId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("/:id")
  async getRoomsById(@Param("id") roomId: string) {
    return await this.roomService.getRoomsById(roomId);
  }

  @UseGuards(UserJwtAuthGuard) // new
  @Get("/me/team/:id")
  async getJoinedRooms(@Param("id") teamId: string) {
    return await this.roomService.getJoinedRoom(teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete("/disband")
  async deleteRoom(@Body() req: DeleteRoomDto) {
    return await this.roomService.disband(req);
  }

  // room note

  @UseGuards(UserJwtAuthGuard)
  @Get("/:id/note")
  async getRoomsNotes(@Param("id") roomId: string) {
    return await this.roomNoteService.getRoomNotes(roomId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Post("/:id/note")
  async createRoomNote(
    @Param("id") roomId: string,
    @Body() body: CreateRoomNoteDto
  ) {
    return await this.roomNoteService.create(roomId, body);
  }

  @UseGuards(UserJwtAuthGuard)
  @Put("/note/:id")
  async updateRoomNote(
    @Param("id") noteId: string,
    @UserSubject() user: User,
    @Body() body: UpdateRoomNoteDto
  ) {
    return await this.roomNoteService.update(noteId, user.id, body);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete("/note/:id")
  async deleteRoomNote(@Param("id") noteId: string, @UserSubject() user: User) {
    return await this.roomNoteService.delete(noteId, user.id);
  }

  // room request

  @UseGuards(UserJwtAuthGuard)
  @Get("/:id/request")
  async getRoomsRequest(@Param("id") roomId: string) {
    return await this.roomRequestService.getRoomRequest(roomId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get("/request/team/:id")
  async getRoomsRequestByTeam(@Param("id") teamId: string) {
    return await this.roomRequestService.getRoomRequestByTeamId(teamId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Post("/:id/request")
  async createRoomRequest(
    @Param("id") roomId: string,
    @Body() body: CreateRoomRequestDto
  ) {
    return await this.roomRequestService.create(roomId, body);
  }

  @UseGuards(UserJwtAuthGuard)
  @Delete("/request/:id")
  async deleteRoomRequest(
    @Param("id") requestId: string,
    @UserSubject() user: User
  ) {
    return await this.roomRequestService.delete(requestId, user.id);
  }
}
