import { BadRequestException, Injectable } from "@nestjs/common";
import { Appointment, AppointmentMember } from "@prisma/client";
import { UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { PrismaService } from "src/prisma/prisma.service";

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

  async getAppointment(roomId: string, teamId: string) {
    try {
      if (roomId) {
        return await this.prisma.appointment.findMany({
          where: { roomId, isDeleted: false }
        });
      }
      if (teamId) {
        const appointments = await this.prisma.appointmentMember.findMany({
          where: {
            teamId
          }
        });

        return await this.prisma.appointment.findMany({
          where: {
            id: {
              in: appointments.flatMap((e) => (e.appointmentId ? [ e.appointmentId ] : []))
            },
            isDeleted: false
          }
        });
      }

      return await this.prisma.appointment.findMany({
        where: { isDeleted: false }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getOthersByUserId(userId: string) {
    try {
      const member = await this.prisma.teamMember.findFirst({
        where: { userId }
      });

      if (member === null) {
        return [];
      }
      const appointmentMember = await this.prisma.appointmentMember.findMany({
        where: {
          teamId: member.teamId
        }
      });
      const appointments = await this.prisma.appointment.findMany({
        where: {
          id: {
            in: appointmentMember.flatMap((e) => (e.appointmentId ? [ e.appointmentId ] : []))
          },
          isDeleted: false
        }
      });

      const res = await Promise.all(
        appointments.map((appoint) => this.packOtherAppointment(appoint, member.teamId))
      );

      return res;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async packOtherAppointment(appointment: Appointment, teamId: string) {
    // FIXME: use find first for now as the game has cap of 2
    const appointMember = await this.prisma.appointmentMember.findFirst({
      where: {
        appointmentId: appointment.id,
        isLeft: false,
        NOT: {
          teamId
        }
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

  async update(appointmentId: string, data: UpdateAppointmentDto) {
    return await this.prisma.appointment.update({
      where: {
        id: appointmentId
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

  async delete(appointmentId: string) {
    await this.prisma.appointment.update({
      where: {
        id: appointmentId
      },
      data: {
        isDeleted: true,
        room: {
          delete: true
        }
      }
    });
  }
}
