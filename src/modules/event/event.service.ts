import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { Appointment, Event, EventParticipant, User } from "@prisma/client";

import { getDatetimeWithOffset } from "common/utils/date";
import { paginate } from "common/utils/pagination";
import {
  CreateEventParticipantDto,
  EventParticipantApprovalPayloadDto,
  UpdateEventParticipantDto
} from "model/dto/event-participant.dto";
import { CreateEventRoundDto, UpdateEventRoundDto } from "model/dto/event-round.dto";
import {
  CreateEventAppointmentsDto,
  CreateEventDto,
  EventDetailResponseDto,
  UpdateEventDto
} from "model/dto/event.dto";
import { EventLobbyDetailResponseDto } from "model/dto/room.dto";
import { PrismaService } from "prisma/prisma.service";
import { Pagination } from "types/local";

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllEvents(filter: {
    pagination?: Pagination;
    clause?: Partial<Event>;
    statuses?: ("active" | "upcoming" | "completed")[];
  }): Promise<Event[]> {
    const curerntTime = getDatetimeWithOffset(new Date(), 7);

    return await this.prisma.event.findMany({
      ...(filter.pagination && paginate(filter.pagination)),
      ...(filter.clause && {
        where: {
          ...filter.clause,
          ...(filter.statuses && {
            OR: filter.statuses.map((status) => (
              status === "active" ? ({
                startAt: { gte: curerntTime },
                endAt: { lt: curerntTime }
              }) : status === "upcoming" ? ({
                startAt: { lt: curerntTime }
              }) : status === "completed" ? ({
                endAt: { lte: curerntTime }
              }) : ({})
            ))
          })
        }
      })
    });
  }

  async getEventByRoundId(roundId: string): Promise<Event> {
    return await this.prisma.event.findFirstOrThrow({
      where: {
        rounds: {
          some: {
            id: roundId
          }
        }
      }
    });
  }

  async getEventById(id: string): Promise<Event> {
    return await this.prisma.event.findUniqueOrThrow({
      where: { id }
    });
  }

  async getEventWithDetailById(
    id: string,
    isTeamIncluded?: boolean
  ): Promise<EventDetailResponseDto> {
    return await this.prisma.event.findUniqueOrThrow({
      where: { id },
      include: {
        rounds: true,
        ...(isTeamIncluded
          ? {
            participants: {
              include: { team: true }
            }
          }
          : {
            participants: true
          })
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
      const event = await this.prisma.event.findUniqueOrThrow({
        where: { id },
        select: { isApprovalRequired: true }
      });

      const isChanged = data.isApprovalRequired !== event.isApprovalRequired;

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
      const event = await this.prisma.event.findUniqueOrThrow({
        where: { id },
        select: {
          isApprovalRequired: true,
          maxParticipantCount: true
        }
      });

      const isChanged = data.maxParticipantCount !== event.maxParticipantCount;

      if (isChanged) {
        const currentParticipantCount = await this.prisma.eventParticipant.count({
          where: {
            eventId: id,
            ...(event.isApprovalRequired && { approvalStatus: "APPROVED" })
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
      select: {
        isApprovalRequired: true,
        maxParticipantCount: true
      }
    });
    const currentParticipantCount = await this.prisma.eventParticipant.count({
      where: {
        eventId,
        ...(event.isApprovalRequired && { approvalStatus: "APPROVED" })
      }
    });

    if (event.maxParticipantCount && currentParticipantCount >= event.maxParticipantCount) {
      throw new ConflictException("cannot join, the event is full");
    }

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

  async getEventRooms(
    id: string,
    roundId?: string,
    user?: User
  ): Promise<EventLobbyDetailResponseDto> {
    const event = await this.prisma.event.findUniqueOrThrow({ where: { id } });

    const appointment = roundId
      ? { eventRoundId: roundId }
      : {
        eventRound: {
          event: { id }
        }
      };

    const rooms = await this.prisma.room.findMany({
      where: {
        appointment
      },
      include: {
        appointment: true,
        members: true
      }
    });

    if (!user) {
      return {
        rooms,
        userGameTeams: [],
        hostedRoomIds: [],
        joinedRoomIds: [],
        pendingRoomIds: [],
        roomPendings: []
      };
    }

    const userGameTeams = await this.prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: user.id
          }
        }
      }
    });

    const thisEventUserTeam = userGameTeams.find((team) => team.gameId === event.gameId);

    if (!thisEventUserTeam) {
      throw new InternalServerErrorException(
        "cannot find user team in the specific event's game"
      );
    }

    const hostedRoomIds = rooms
      .filter((room) => room.hostTeamId === thisEventUserTeam.id)
      .map((room) => room.id);

    const joinedRooms = await this.prisma.room.findMany({
      where: {
        appointment,
        members: {
          some: {
            teamId: thisEventUserTeam.id
          }
        }
      },
      select: { id: true }
    });

    const joinedRoomIds = joinedRooms.map((e) => e.id);

    return {
      rooms,
      userGameTeams,
      hostedRoomIds,
      joinedRoomIds,
      pendingRoomIds: [],
      roomPendings: []
    };
  }

  async deleteEventById(id: string): Promise<void> {
    await this.prisma.event.delete({
      where: { id }
    });
  }

  // partitipants

  async approveParticipants(
    eventId: string,
    payload: EventParticipantApprovalPayloadDto
  ): Promise<void> {
    const event = await this.prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: {
        maxParticipantCount: true,
        isApprovalRequired: true
      }
    });
    const currentParticipantCount = await this.prisma.eventParticipant.count({
      where: {
        eventId,
        ...(event.isApprovalRequired && { approvalStatus: "APPROVED" })
      }
    });

    if (
      payload.approvalStatus === "APPROVED"
      && event.maxParticipantCount
      && currentParticipantCount + payload.participantIds.length > event.maxParticipantCount
    ) {
      throw new ConflictException(
        "the number of to-be approved participants exceed 'maxParticipantCount'"
      );
    }

    await this.prisma.eventParticipant.updateMany({
      where: { id: { in: payload.participantIds } },
      data: { approvalStatus: payload.approvalStatus }
    });
  }

  async updateEventParticipant(
    id: string,
    data: UpdateEventParticipantDto
  ): Promise<EventParticipant> {
    const { approvalStatus, ...payload } = data;

    if (approvalStatus) {
      const { eventId } = await this.prisma.eventParticipant.findUniqueOrThrow({
        where: { id },
        select: { eventId: true }
      });

      await this.approveParticipants(eventId, { approvalStatus, participantIds: [ id ] });
    }

    return await this.prisma.eventParticipant.update({
      where: { id },
      data: payload
    });
  }

  // rounds

  async addEventRound(data: CreateEventRoundDto) {
    return await this.prisma.eventRound.create({
      data
    });
  }

  async addParticipantToEventByAdmin(
    data: CreateEventParticipantDto
  ): Promise<EventParticipant> {
    return await this.prisma.eventParticipant.create({
      data
    });
  }

  async updateEventRoundById(id: string, data: UpdateEventRoundDto) {
    return await this.prisma.eventRound.update({
      where: { id },
      data
    });
  }

  async deleteEventRoundById(id: string): Promise<void> {
    await this.prisma.eventRound.delete({
      where: { id }
    });
  }

  // appointments

  async createEventAppointments(
    eventId: string,
    payload: CreateEventAppointmentsDto
  ): Promise<Appointment[]> {
    const event = await this.prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: {
        gameId: true,
        participants: {
          select: { teamId: true }
        }
      }
    });

    const participantTeamIds = event.participants.map((e) => e.teamId);
    const incomingTeamIds = payload.matches.flatMap((e) => [ e.guestTeamId, e.hostTeamId ]);

    if (!incomingTeamIds.every((id) => participantTeamIds.includes(id))) {
      throw new BadRequestException(
        "some incoming host or guest teams are not the event participant"
      );
    }

    const appointments = await Promise.all(
      payload.matches.map((match) =>
        this.prisma.appointment.create({
          data: {
            startAt: payload.startAt,
            endAt: payload.endAt,
            eventRoundId: payload.roundId,
            members: {
              createMany: {
                data: [
                  {
                    teamId: match.hostTeamId
                  },
                  {
                    teamId: match.guestTeamId
                  }
                ]
              }
            },
            room: {
              create: {
                name: match.roomName,
                hostTeamId: match.hostTeamId,
                gameId: event.gameId,
                members: {
                  createMany: {
                    data: [
                      {
                        teamId: match.hostTeamId
                      },
                      {
                        teamId: match.guestTeamId
                      }
                    ]
                  }
                },
                settings: {
                  create: {}
                },
                chat: {
                  create: {}
                }
              }
            }
          }
        })
      )
    );

    return appointments;
  }
}
