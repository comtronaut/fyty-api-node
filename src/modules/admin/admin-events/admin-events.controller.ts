import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { HttpCode, Query, UseGuards } from "@nestjs/common/decorators";
import { CreateEventParticipantDto, UpdateEventParticipantDto } from "model/dto/event-participant.dto";

import { CreateEventDto, UpdateEventDto } from "model/dto/event.dto";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { EventService } from "modules/event/event.service";

@Controller("admin/events")
@UseGuards(AdminJwtAuthGuard)
export class AdminEventsController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEventAsAdmin(@Body() payload: CreateEventDto) {
    return await this.eventService.createEvent(payload);
  }

  @Get()
  async getAllEventsAsAdmin(
    @Query("name") name?: string,
    @Query("page") page?: string,
    @Query("perPage") perPage?: string
  ) {
    return await this.eventService.getEventsFilter({
      ...([ page, perPage ].every(Boolean) && {
        pagination: {
          page: Number(page),
          perPage: Number(perPage)
        }
      }),
      clause: {
        ...(name && { name })
      }
    });
  }

  @Get(":id")
  async getEventByIdAsAdmin(@Param("id") id: string) {
    return await this.eventService.getEventById(id);
  }

  @Put(":id")
  async updateEventByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateEventDto) {
    return await this.eventService.updateEventById(id, payload);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEventByIdAsAdmin(@Param("id") id: string): Promise<void> {
    return await this.eventService.deleteEventById(id);
  }

  // Event Parti CRUD

  @Post("/participants")
  async addEventParticipantAsAdmin(@Body() payload: CreateEventParticipantDto) {
    return await this.eventService.addParticipantToEventByAdmin(payload);
  }

  @Put("/participants/:id")
  async updateEventParticipantByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateEventParticipantDto) {
    return await this.eventService.updateEventParticipant(id, payload);
  }

  @Delete("/participants/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEventParticipantByIdAsAdmin(@Param("id") id: string): Promise<void> {
    return await this.eventService.removeParticipantFromEvent(id);
  }
}
