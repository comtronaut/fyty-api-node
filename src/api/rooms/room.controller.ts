import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { start } from "repl";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";
import { Subject } from "src/common/subject.decorator";
import { CreateParticipantDto, CreateRoomDto, CreateRoomNoteDto, UpdateParticipantDto, UpdateRoomDto, UpdateRoomNoteDto } from "src/model/dto/room/room.dto";
import { User } from "src/model/sql-entity/user/user.entity";
import { RoomService } from "./room.service";
import { RoomNoteService } from "./note/note.service";
import { RoomRequestService } from "./request/request.service";
import { CreateRoomRequestDto } from "src/model/dto/room/request.dto";

@Controller("api/rooms")
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomNoteService: RoomNoteService,
    private readonly roomRequestService: RoomRequestService
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
  @Get("/game/:id")
  async getRoomsBygame(       // 
    @Param("id") gameId: string,
    @Query("name") roomName?: string,
    @Query("date") date?: any
  ) {
    return this.roomService.getAllRooms(gameId, roomName, date);
  }

  @UseGuards(JwtAuthGuard)  // get all rooms which u r host
  @Get("/team/:id")
  async getHostedRooms(
    @Param("id") teamId: string,
  ){
    return this.roomService.getRoomByHostId(teamId);
  }

  @UseGuards(JwtAuthGuard)  // get all rooms which u r host
  @Get("/me/game/:id")
  async getTodayRooms(
    @Param("id") gameId: string,
    @Query("date") date: string
  ){
    return this.roomService.getRoomsByDate(date, gameId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async getRoomsById(
    @Param("id") roomId: string,
  ) {
    return this.roomService.getAllRooms(roomId);
  }

  @UseGuards(JwtAuthGuard)    // new
  @Get("/me/team/:id")
  async getJoidedRooms(
    @Param("id") teamId: string,
  ) {
    return this.roomService.getJoidedRoom(teamId);
  }

// room note

  @UseGuards(JwtAuthGuard)
  @Get("/:id/note")
  async getRoomsNotes(
    @Param("id") roomId: string
  ) 
  {
    return this.roomNoteService.getRoomNotes(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/note")
  async createRoomNote(
    @Param("id") roomId: string,
    @Body() body: CreateRoomNoteDto,
    ) 
  {
    return this.roomNoteService.create(roomId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/note/:id")
  async updateRoomNote(
    @Param("id") noteId: string,
    @Subject() user: User,
    @Body() body: UpdateRoomNoteDto,
    ) 
  {
    return this.roomNoteService.update(noteId, user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/note/:id")
  async deleteRoomNote(
    @Param("id") noteId: string,
    @Subject() user: User,
    ) 
  {
    return this.roomNoteService.delete(noteId, user.id);
  }

// room request

  @UseGuards(JwtAuthGuard)
  @Get("/:id/request")
  async getRoomsRequest(
    @Param("id") roomId: string
  ) 
  {
    return this.roomRequestService.getRoomRequest(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:id/request")
  async createRoomRequest(
    @Param("id") roomId: string,
    @Body() body: CreateRoomRequestDto,
    ) 
  {
    return this.roomRequestService.create(roomId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/request/:id")
  async deleteRoomRequest(
    @Param("id") requestId: string,
    @Subject() user: User,
    ) 
  {
    return this.roomRequestService.delete(requestId, user.id);
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
