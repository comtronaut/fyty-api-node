import { Injectable } from "@nestjs/common";
import { Appointment, AppointmentMember, Team } from "@prisma/client";
import { UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AppointmentStatus } from "src/types/local";
import { AppointmentPack } from "src/types/query-detail";

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
  ): Promise<AppointmentPack[]> {
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

  async getOthersOfUser(userId: string): Promise<AppointmentPack[]> {
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
    return await this.prisma.appointment.update({
      where: {
        id
      },
      data: {
        ...data,
        ...((data.endAt || data.startAt) && {
          room: {
            update: {
              startAt: data.startAt,
              endAt: data.endAt
            }
          }
        })
      }
    });
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
