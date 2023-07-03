import { Injectable } from "@nestjs/common";
import { Appointment, AppointmentMember, Team } from "@prisma/client";

import { AppointmentPackResponseDto, UpdateAppointmentDto } from "model/dto/appointment.dto";
import { PrismaService } from "prisma/prisma.service";
import { AppointmentStatus } from "types/local";

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Appointment[]> {
    return await this.prisma.appointment.findMany();
  }

  async getById(id: string): Promise<Appointment> {
    return await this.prisma.appointment.findFirstOrThrow({ where: { id } });
  }

  async getMembersById(id: string): Promise<AppointmentMember[]> {
    const { members } = await this.prisma.appointment.findFirstOrThrow({
      where: { id },
      select: { members: true }
    });
    return members;
  }

  async getOthersOfTeam(
    teamId: string,
    status?: AppointmentStatus
  ): Promise<AppointmentPackResponseDto[]> {
    const res = await this.prisma.appointmentMember.findMany({
      where: {
        teamId,
        isLeft: false,
        ...(status === "UPCOMING" && {
          appointment: {
            startAt: {
              gt: new Date()
            }
          }
        }),
        ...(status === "ONGOING" && {
          appointment: {
            AND: [
              {
                startAt: {
                  lte: new Date()
                }
              },
              {
                endAt: {
                  gt: new Date()
                }
              }
            ]
          }
        })
      },
      select: { appointment: true }
    });

    return await Promise.all(
      res.map((e) => this.packOtherAppointment(e.appointment, teamId))
    );
  }

  async getOthersOfUser(userId: string): Promise<AppointmentPackResponseDto[]> {
    const res = await this.prisma.teamMember.findMany({
      where: { userId },
      select: {
        teamId: true,
        team: {
          select: {
            appointmentMembers: {
              select: {
                appointment: true
              }
            }
          }
        }
      }
    });

    const appointments = res.flatMap((e) =>
      e.team.appointmentMembers.map((f) => [ e.teamId, f.appointment ] as const)
    );

    return await Promise.all(
      appointments.map(([ myTeamId, appointment ]) =>
        this.packOtherAppointment(appointment, myTeamId)
      )
    );
  }

  async packOtherAppointment(
    appointment: Appointment,
    teamId: string
  ): Promise<{ appointment: Appointment; team: Team | null }> {
    // FIXME: use find first for now as the game has cap of 2
    const appointMember = await this.prisma.appointmentMember.findFirst({
      where: {
        appointmentId: appointment.id,
        isLeft: false,
        NOT: { teamId }
      },
      select: {
        team: true
      }
    });

    return {
      appointment,
      team: appointMember?.team ?? null
    };
  }

  async update(id: string, data: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.update({
      where: { id },
      data
    });

    if ((data.endAt || data.startAt) && appointment.roomId) {
      await this.prisma.room.updateMany({
        where: { id: appointment.roomId },
        data: {
          ...(data.startAt && { startAt: data.startAt }),
          ...(data.endAt && { endAt: data.endAt })
        }
      });
    }

    return appointment;
  }

  async delete(id: string, isDeletedBefore = false) {
    await this.prisma.appointment.update({
      where: { id },
      data: {
        isDeleted: true,
        ...(isDeletedBefore && { deletedBeforeAt: new Date() }),
        room: {
          delete: true
        },
        members: {
          update: {
            where: {},
            data: { isLeft: true }
          }
        }
      }
    });
  }
}
