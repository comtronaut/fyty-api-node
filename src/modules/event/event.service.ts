import { Injectable } from "@nestjs/common";
import { Event, Room } from "@prisma/client";
import { compact } from "lodash";

import { paginate } from "common/utils/pagination";
import { CreateEventDto, UpdateEventDto } from "model/dto/event.dto";
import { PrismaService } from "prisma/prisma.service";
import { Pagination } from "types/local";

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllEvents() {
    return await this.prisma.event.findMany({});
  }

  async getEventById(id: string) {
    return await this.prisma.event.findMany({
      where: { id }
    });
  }

  async getEventWithDetailById(id: string) {
    return await this.prisma.event.findMany({
      where: { id },
      include: {
        rounds: true,
        participants: true
      }
    });
  }

  async createEvent(data: CreateEventDto) {
    return await this.prisma.event.create({
      data
    });
  }

  async updateEventById(id: string, data: UpdateEventDto) {
    return await this.prisma.event.update({
      where: { id },
      data
    });
  }

  async joinParticipantIntoEvent(eventId: string, teamId: string) {
    return await this.prisma.eventParticipant.create({
      data: {
        eventId,
        teamId
      }
    });
  }

  async removeParticipantFromEvent(participantId: string) {
    return this.prisma.eventParticipant.delete({
      where: { id: participantId }
    });
  }

  async getEventsFilter(filter: { pagination?: Pagination; clause: Partial<Event> }) {
    return await this.prisma.event.findMany({
      ...(filter.pagination && paginate(filter.pagination)),
      ...(filter.clause && {
        where: filter.clause
      })
    });
  }

  async getEventRooms(id: string, roundId?: string): Promise<Room[]> {
    const queryResult = await this.prisma.eventRound.findMany({
      where: {
        ...(roundId && { id: roundId }),
        eventId: id
      },
      select: {
        appointments: {
          select: {
            room: true
          }
        }
      }
    });

    return compact(queryResult.flatMap((e) => e.appointments.map((e) => e.room)));
  }

  async deleteEventById(id: string) {
    return await this.prisma.event.delete({
      where: { id }
    });
  }
}
