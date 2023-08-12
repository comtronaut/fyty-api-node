import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { HttpCode, Query, UseGuards } from "@nestjs/common/decorators";
import { CreateEventRoundDto, UpdateEventRoundDto } from "model/dto/event-round.dto";

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
  async deleteEventByIdAsAdmin(@Param("id") id: string) {
    return await this.eventService.deleteEventById(id);
  }

  // EventRound

  @Post("/rounds")
  async addEventRoundAsAdmin(@Body() payload: CreateEventRoundDto) {
    return await this.eventService.addEventRound(payload);
  }

  @Put("/rounds/:id")
  async updateEventRoundByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateEventRoundDto) {
    return await this.eventService.updateEventRoundById(id, payload);
  }

  @Delete("/rounds/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEventRoundByIdAsAdmin(@Param("id") id: string) {
    return await this.eventService.deleteEventRoundById(id);
  }
}
