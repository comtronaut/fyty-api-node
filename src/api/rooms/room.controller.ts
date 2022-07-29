import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { start } from "repl";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";
import { Subject } from "src/common/subject.decorator";
import { CreateParticipantDto, CreateRoomDto, CreateRoomNoteDto, UpdateParticipantDto, UpdateRoomDto, UpdateRoomNoteDto } from "src/model/dto/room.dto";
import { User } from "src/model/sql-entity/user/user.entity";
import { RoomService } from "./room.service";
import { RoomNoteService } from "./roomNote/note.service";

@Controller("api/rooms")
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomNoteService: RoomNoteService,
    ) { }

  @Debug()                  // only on test
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRoom(     
    @Body() req: CreateRoomDto,
    ) 
  {
    return this.roomService.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getRooms(
    @Param("name") roomName: string,
    @Param("startAt") startAt: Date
  ) {
    return this.roomService.getAllRooms(roomName, startAt);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/game/:id")
  async getRoomsBygame(
    @Param("gameId") gameId: string
  ) {
    return this.roomService.getRoomsByGameId(gameId);
  }

// room note

  @UseGuards(JwtAuthGuard)
  @Get("/:id/note")
  async getRoomsNotes(
    @Param("roomId") roomId: string
  ) 
  {
    return this.roomNoteService.getRoomNotes(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/note")
  async createRoomNote(
    @Param("roomId") roomId: string,
    @Body() body: CreateRoomNoteDto,
    ) 
  {
    return this.roomNoteService.create(roomId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/note/:id")
  async updateRoomNote(
    @Param("noteId") noteId: string,
    @Subject() user: User,
    @Body() body: UpdateRoomNoteDto,
    ) 
  {
    return this.roomNoteService.update(noteId, user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/note/:id")
  async deleteRoomNote(
    @Param("noteId") noteId: string,
    @Subject() user: User,
    ) 
  {
    return this.roomNoteService.delete(noteId, user.id);
  }

  


  // @Get("/participants/:roomId")
  // async getParticipantByRoomId(@Param("roomId") roomId: string) {
  //   return this.participantService.getParticipantByRoomId(roomId);
  // }

  // @Debug()
  // // @UseGuards(JwtAuthGuard)
  // @Post("/participants")
  // async joinRoom(@Body() req: CreateParticipantDto) {   // need both roomId, teamId for creating
  //   return await this.roomService.joinRoom(req);
  // }

  // @Debug()
  // // @UseGuards(JwtAuthGuard)
  // @Delete("/participants")
  // async leaveRoom(@Body() req: CreateParticipantDto) {  // need both roomId, teamId for deleting
  //   return await this.roomService.leaveRoom(req);
  // }

  // // two routes have overlapped each other
  // // so the shorter(url) one will be below

  // @Debug()
  // @Put("/:roomId")
  // async updateRoom(
  //   @Param("roomId") roomId: string,
  //   @Body() req: UpdateRoomDto    // need only one of these properties for updating
  //   ) {    
  //   return await this.roomService.update(roomId, req);
  // }

  // @Debug()
  // @Delete(":id")
  // async deleteRoom(
  //   @Param("id") partiId: string) {    
  //   return await this.roomService.leaveRoom(partiId);
  // }
  
}
