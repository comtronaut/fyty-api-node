import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Debug } from "src/common/debug.decorator";
import { Subject } from "src/common/subject.decorator";
import { CreateParticipantDto, CreateRoomDto, UpdateParticipantDto, UpdateRoomDto } from "src/model/dto/room.dto";
import { User } from "src/model/sql-entity/user.entity";
import { RoomParticipantService } from "./participants/room-participant.service";
import { RoomService } from "./room.service";

@Controller("api/rooms")
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly participantService: RoomParticipantService,
    ) { }

  @Get("/participants/:roomId")
  async getParticipantByRoomId(@Param("roomId") roomId: string) {
    return this.participantService.getParticipantByRoomId(roomId);
  }

  @Debug()
  // @UseGuards(JwtAuthGuard)
  @Post("/participants")
  async joinRoom(@Body() req: CreateParticipantDto) {    
    return await this.roomService.joinRoom(req);
  }

  @Debug()
  // @UseGuards(JwtAuthGuard)
  @Delete("/participants")
  async leaveRoom(@Body() req: CreateParticipantDto) {  
    return await this.roomService.leaveRoom(req);
  }

  @Debug()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRoom(
    @Subject() user: User,
    @Body() req: CreateRoomDto,
    ) {
    return this.roomService.create(user, req);
  }



  @Get("/:gameId")
  async getRoomsByGameId(@Param("gameId") gameId: string) {
    return this.roomService.getRoomsByGameId(gameId);
  }

  @Debug()
  @Put("/:roomId")
  async updateRoom(
    @Param("roomId") roomId: string,
    @Body() req: UpdateRoomDto
    ) {    
    return await this.roomService.update(roomId, req);
  }

  @Debug()
  @Delete("/:roomId")
  async deleteRoom(@Param("roomId") roomId: string) {    
    return await this.roomService.delete(roomId);
  }
  
}
