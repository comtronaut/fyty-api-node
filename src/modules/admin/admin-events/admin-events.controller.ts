import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Query, UseGuards } from "@nestjs/common/decorators";

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
  async updateEventByIdAsAdmin(
    @Param("id") id: string,
    @Body() payload: UpdateEventDto
  ) {
    return await this.eventService.updateEventById(id, payload);
  }

  @Delete(":id")
  async deleteEventByIdAsAdmin(@Param("id") id: string) {
    return await this.eventService.deleteEventById(id);
  }
}
