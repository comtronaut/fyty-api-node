import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";
import { Subject } from "src/common/subject.decorator";
import { CreateParticipantDto, CreateRoomDto, UpdateParticipantDto, UpdateRoomDto } from "src/model/dto/room.dto";
import { User } from "src/model/sql-entity/user/user.entity";
import { RoomParticipantService } from "./participants/room-participant.service";
import { RoomService } from "./room.service";

@Controller("api/rooms")
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly participantService: RoomParticipantService,
    ) { }

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

  @UseGuards(JwtAuthGuard)
  @Post()
  async createRoom(
    // this is abstraction, think that user will be auto-generated from JwtAuthGuard
    // so if you want to use @Subject, you have to use @UseGuards(JwtAuthGuard) first
    // if you dont familiar with using Entity (user: User), just using id and findOne
    // but this will make your coding much more easier, if you have a chance, just try it
    // validationPipe is a keyword for this method (Subject decorator implementation is in common file if you want to read it)
    @Body() req: CreateRoomDto,
    ) {
     return this.roomService.create(req);
  }

  // @Get("/:gameId")
  // async getRoomsByGameId(@Param("gameId") gameId: string) {
  //   return this.roomService.getRoomsByGameId(gameId);
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getRooms() {
    return this.roomService.getAllRooms();
  }

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
