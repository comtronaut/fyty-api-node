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
  Query,
  UseGuards
} from "@nestjs/common";
import { Event, User } from "@prisma/client";
import { uniq } from "lodash";

import { UserSubject } from "common/subject.decorator";
import { createPagination } from "common/utils/pagination";
import { CreateEventParticipantDto } from "model/dto/event-participant.dto";
import { UserJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";

import { EventService } from "./event.service";

@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvents(
    @Query("q") q?: string,
    @Query("status") status?: string,
    @Query("gameId") gameId?: string,
    @Query("perPage") perPage?: string,
    @Query("page") page?: string
  ) {
    const parsedStatuses = status ? status.split(",").filter(Boolean) : [];

    if (
      !parsedStatuses.every((status) =>
        [ "active", "upcoming", "completed" ].includes(status)
      )
    ) {
      throw new BadRequestException(
        "status query values must be 'active', 'upcomeing', 'completed'"
      );
    }

    const validatedStatuses = uniq(parsedStatuses) as (
      | "active"
      | "upcoming"
      | "completed"
    )[];

    const clause: Partial<Event> = {
      ...(gameId && { gameId }),
      ...(q && { name: q })
    };

    return await this.eventService.getAllEvents({
      ...createPagination(page, perPage),
      ...(!Object.keys(clause).length && { clause }),
      ...(validatedStatuses.length && { statuses: validatedStatuses })
    });
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

  @Get("rounds/:id")
  async getEventByRoundId(@Param("id") roundId: string) {
    return await this.eventService.getEventByRoundId(roundId);
  }
}
