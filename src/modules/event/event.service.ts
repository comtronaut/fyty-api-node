import { ConflictException, Injectable } from "@nestjs/common";
import { Event, EventParticipant, Room } from "@prisma/client";
import { compact } from "lodash";

import { paginate } from "common/utils/pagination";
import {
  CreateEventDto,
  EventDetailResponseDto,
  UpdateEventDto
} from "model/dto/event.dto";
import { PrismaService } from "prisma/prisma.service";
import { Pagination } from "types/local";

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllEvents(): Promise<Event[]> {
    return await this.prisma.event.findMany({});
  }

  async getEventById(id: string): Promise<Event> {
    return await this.prisma.event.findUniqueOrThrow({
      where: { id }
    });
  }

  async getEventWithDetailById(id: string): Promise<EventDetailResponseDto> {
    return await this.prisma.event.findUniqueOrThrow({
      where: { id },
      include: {
        rounds: true,
        participants: true
      }
    });
  }

  async createEvent(data: CreateEventDto): Promise<Event> {
    return await this.prisma.event.create({
      data
    });
  }

  async updateEventById(id: string, data: UpdateEventDto): Promise<Event> {
    // when update 'isApprovalRequired'
    if (typeof data.isApprovalRequired === "boolean") {
      const { isApprovalRequired } = await this.prisma.event.findUniqueOrThrow({
        where: { id },
        select: { isApprovalRequired: true }
      });

      const isChanged = data.isApprovalRequired !== isApprovalRequired;

      if (isChanged) {
        await this.prisma.eventParticipant.updateMany({
          where: { eventId: id },
          data: {
            approvalStatus: data.isApprovalRequired ? "PENDING" : null
          }
        });
      }
    }

    // when update 'maxParticipantCount'
    if (typeof data.maxParticipantCount === "number") {
      const { isApprovalRequired, maxParticipantCount }
        = await this.prisma.event.findUniqueOrThrow({
          where: { id },
          select: {
            isApprovalRequired: true,
            maxParticipantCount: true
          }
        });

      const isChanged = data.maxParticipantCount !== maxParticipantCount;

      if (isChanged) {
        const currentParticipantCount = await this.prisma.eventParticipant.count({
          where: {
            eventId: id,
            ...(isApprovalRequired && { approvalStatus: "APPROVED" })
          }
        });

        if (currentParticipantCount > data.maxParticipantCount) {
          throw new ConflictException(
            "the to-be updated 'maxParticipantCount' must be less than the current event participant count"
          );
        }
      }
    }

    return await this.prisma.event.update({
      where: { id },
      data
    });
  }

  async joinParticipantIntoEvent(
    eventId: string,
    teamId: string
  ): Promise<EventParticipant> {
    const event = await this.prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: { isApprovalRequired: true }
    });

    return await this.prisma.eventParticipant.create({
      data: {
        eventId,
        teamId,
        ...(event.isApprovalRequired && { approvalStatus: "PENDING" })
      }
    });
  }

  async removeParticipantFromEvent(participantId: string): Promise<void> {
    await this.prisma.eventParticipant.delete({
      where: { id: participantId }
    });
  }

  async getEventsFilter(filter: {
    pagination?: Pagination;
    clause: Partial<Event>;
  }): Promise<Event[]> {
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

  async deleteEventById(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id }
    });
  }
}
