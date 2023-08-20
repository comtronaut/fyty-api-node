import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { User } from "@prisma/client";

import { UserSubject } from "common/subject.decorator";
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

  @Delete("participants/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(UserJwtAuthGuard)
  async removeEventParticipant(@Param("id") id: string): Promise<void> {
    return await this.eventService.removeParticipantFromEvent(id);
  }

  @Get(":id/rooms")
  @UseGuards(UserJwtAuthGuard)
  async getEventRoomsByEventId(
    @UserSubject() user: User,
    @Param("id") id: string,
    @Query("round") roundId?: string
  ) {
    return await this.eventService.getEventRooms(id, roundId, user);
  }
}
