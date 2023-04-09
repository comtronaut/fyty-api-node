import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { CreateAppointmentDto, UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { UpdateUserDto } from "src/model/dto/user.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class AdminAppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAppointment() {
    try {
      return await this.prisma.appointment.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //CRUD
  async create(req: CreateAppointmentDto) {
    try {
      const room = await this.prisma.room.findUniqueOrThrow({
        where: { id: req.roomId }
      });

      // create appointment
      req.startAt = room.startAt;
      req.endAt = room.endAt;

      const { teamIds, ...data } = req;

      const res = await this.prisma.appointment.create({ data });

      // create appointment member
      const memberIds = req.teamIds.split(",");

      await this.prisma.appointmentMember.createMany({
        data: memberIds.map((memberId) => ({
          appointId: res.id,
          teamId: memberId
        }))
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAppointment(appointmentId: string) {
    try {
      return await this.prisma.appointment.findUniqueOrThrow({
        where: {
          id: appointmentId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAppointmentMember(appointmentId: string) {
    try {
      return await this.prisma.appointmentMember.findMany({
        where: {
          appointId: appointmentId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  async update(appointmentId: string, payload: UpdateAppointmentDto) {
    try {
      return await this.prisma.appointment.update({
        where: {
          id: appointmentId
        },
        data: payload
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(appoinmentId: string) {
    try {
      return await this.prisma.user.delete({
        where: {
          id: appoinmentId
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
