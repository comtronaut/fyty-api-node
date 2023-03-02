import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { Appointment } from "@prisma/client";
import {
  CreateAppointmentDto,
  UpdateAppointmentDto
} from "src/model/dto/appointment.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  // CRUD
  async create(req: CreateAppointmentDto) {
    try {
      const room = await this.prisma.room.findUniqueOrThrow({
        where: { id: req.roomId }
      });

      // create appointment
      req.startAt = room.startAt;
      req.endAt = room.endAt;
      const res = await this.prisma.appointment.create({ data: req });

      // create appointment member
      const memberIds = req.teamIds.split(",");

      await this.prisma.appointmentMember.createMany({
        data: memberIds.map((memberId) => ({
          appointId: res.id,
          teamId: memberId
        }))
      });

      return res;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAppointment(roomId: string, teamId: string) {
    try {
      if (roomId) {
        return await this.prisma.appointment.findMany({
          where: { roomId, isDel: false }
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
              in: appointments.flatMap((e) =>
                e.appointId ? [ e.appointId ] : []
              )
            },
            isDel: false
          }
        });
      }

      return await this.prisma.appointment.findMany({
        where: { isDel: false }
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
            in: appointmentMember.flatMap((e) =>
              e.appointId ? [ e.appointId ] : []
            )
          },
          isDel: false
        }
      });

      const res = await Promise.all(
        appointments.map((appoint) =>
          this.packAppointment(appoint, member.teamId)
        )
      );

      return res;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async packAppointment(appointment: Appointment, teamId: string) {
    try {
      const appointMember = await this.prisma.appointmentMember.findMany({
        where: { appointId: appointment.id }
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
    try {
      const updateRes = await this.prisma.appointment.update({
        where: {
          id: appointmentId
        },
        data: req
      });

      return await this.prisma.appointment.findUniqueOrThrow({
        where: { id: appointmentId }
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(appointmentId: string) {
    try {
      const res = await this.prisma.appointment.update({
        where: {
          id: appointmentId
        },
        data: { isDel: true }
      });

      return HttpStatus.NO_CONTENT;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
