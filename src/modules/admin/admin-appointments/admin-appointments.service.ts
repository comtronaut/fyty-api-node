import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { PrismaService } from "src/prisma/prisma.service";

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
          appointmentId
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
