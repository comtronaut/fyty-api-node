import { BadRequestException, Injectable } from "@nestjs/common";
import { Appointment } from "@prisma/client";
import { UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { NotifyService } from "../notification/lineNotify.service";

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService, private readonly lineNotify: NotifyService) {}

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

  async getAppointmentByUserId(userId: string) {
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
        appointments.map((appoint) => this.packAppointment(appoint, member.teamId))
      );

      return res;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async packAppointment(appointment: Appointment, teamId: string) {
    try {
      const appointMember = await this.prisma.appointmentMember.findMany({
        where: { appointmentId: appointment.id }
      });

      if (appointMember.length !== 2) {
        return {
          appointment,
          team: null
        };
      }

      let team = null;
      if (appointMember[0].teamId === teamId) {
        team = await this.prisma.team.findUniqueOrThrow({
          where: { id: appointMember[1].teamId }
        });
      } else {
        team = await this.prisma.team.findUniqueOrThrow({
          where: { id: appointMember[0].teamId }
        });
      }

      return {
        appointment,
        team
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async update(appointmentId: string, req: UpdateAppointmentDto) {
    return await this.prisma.appointment.update({
      where: {
        id: appointmentId
      },
      data: req
    });
  }

  async delete(appointmentId: string) {
    await this.prisma.appointment.update({
      where: {
        id: appointmentId
      },
      data: { isDeleted: true }
    });
  }
}
