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

import { createPagination } from "common/utils/pagination";
import { CreateEventParticipantDto, EventParticipantApprovalPayloadDto, UpdateEventParticipantDto } from "model/dto/event-participant.dto";
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
      ...createPagination(page, perPage),
      clause: {
        ...(name && { name })
      }
    });
  }

  @Get(":id")
  async getEventByIdAsAdmin(@Param("id") id: string) {
    return await this.eventService.getEventWithDetailById(id, true);
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

  @Put(":id/participants/approval")
  async putEventParticipantsApprovalAsAdmin(
    @Param("id") id: string,
    @Body() payload: EventParticipantApprovalPayloadDto
  ) {
    return await this.eventService.approveParticipants(id, payload);
  }

  @Post("participants")
  async createEventParticipantAsAdmin(@Body() payload: CreateEventParticipantDto) {
    return await this.eventService.addParticipantToEventByAdmin(payload);
  }

  @Put("participants/:id")
  async updateEventParticipantByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateEventParticipantDto) {
    return await this.eventService.updateEventParticipant(id, payload);
  }

  @Delete("participants/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEventParticipantByIdAsAdmin(@Param("id") id: string): Promise<void> {
    return await this.eventService.removeParticipantFromEvent(id);
  }
  
  // EventRound

  @Post("rounds")
  async createEventRoundAsAdmin(@Body() payload: CreateEventRoundDto) {
    return await this.eventService.addEventRound(payload);
  }

  @Put("rounds/:id")
  async updateEventRoundByIdAsAdmin(@Param("id") id: string, @Body() payload: UpdateEventRoundDto) {
    return await this.eventService.updateEventRoundById(id, payload);
  }

  @Delete("rounds/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEventRoundByIdAsAdmin(@Param("id") id: string): Promise<void> {
    return await this.eventService.deleteEventRoundById(id);
  }
}
