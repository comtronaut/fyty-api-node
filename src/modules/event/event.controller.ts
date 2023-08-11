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

import { CreateEventParticipantDto } from "model/dto/event-participant.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

import { EventService } from "./event.service";

@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvents() {
    return await this.eventService.getAllEvents();
  }

  @Get(":id")
  async getEventById(@Param("id") id: string) {
    return await this.eventService.getEventById(id);
  }

  @Get(":id/detail")
  async getEventDetailById(@Param("id") id: string) {
    return await this.eventService.getEventWithDetailById(id);
  }

  @Post(":id/participants")
  @UseGuards(UserJwtAuthGuard)
  async joinEventParticipant(
    @Param("id") id: string,
    @Body() payload: CreateEventParticipantDto
  ) {
    return await this.eventService.joinParticipantIntoEvent(id, payload.teamId);
  }

  @Delete(":id/participants")
  @UseGuards(UserJwtAuthGuard)
  async removeEventParticipant(@Param("id") id: string) {
    return await this.eventService.removeParticipantFromEvent(id);
  }

  @Get(":id/rooms")
  async getEventRoomsByEventId(@Param("id") id: string, @Query("round") roundId?: string) {
    return await this.eventService.getEventRooms(id, roundId);
  }
}
