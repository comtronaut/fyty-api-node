import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAppointmentDto, UpdateAppointmentDto } from "src/model/dto/appointment.dto";
import { Appointment, AppointmentMember } from "src/model/sql-entity/appointment.entity";
import { In, Repository } from "typeorm";
import { TeamMember } from "src/model/sql-entity/team/team-member.entity";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(TeamMember) private memberModel: Repository<TeamMember>,
    @InjectRepository(Appointment) private appointmentModel: Repository<Appointment>,
    @InjectRepository(AppointmentMember) private appointmentMemberModel: Repository<AppointmentMember>,
  ) { }
  
  // CRUD
  async create(req: CreateAppointmentDto) {
    try {
    // create appointment
      const appointment = this.appointmentModel.create(req);
      const res = await this.appointmentModel.save(appointment);

    // create appointment member

    for(let i in req.teamIds ){
        const member = this.appointmentMemberModel.create({ teamId: i, appointId: res.id });
        await this.appointmentMemberModel.save(member);
    }
      return res;
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAppointment(roomId: string, teamId: string) {
    try{
        if(roomId){
          return await this.appointmentModel.findBy({ roomId: roomId, isDel: false });
        }
        if(teamId){
          const appointments = await this.appointmentMemberModel.findBy({ teamId: teamId });
          return await this.appointmentModel.findBy({ id: In (appointments.map(e => e.appointId )), isDel: false })
        }
        return await this.appointmentModel.findBy({ isDel: false });
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async getAppointmentByUserId(userId: string) {
    try{
        const team = await this.memberModel.findOneByOrFail({ id: userId });
        const appointments = await this.appointmentMemberModel.findBy({ teamId: team.teamId });
        return await this.appointmentModel.findBy({ id: In (appointments.map(e => e.appointId )), isDel: false })
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async update(appointmentId: string, req: UpdateAppointmentDto) {
    try {
      const updateRes = await this.appointmentModel.update(appointmentId, req);

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      return await this.appointmentModel.findOneOrFail({ where: { id: appointmentId }});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(appointmentId: string) {
    try {
      const res = await this.appointmentModel.update({ id: appointmentId }, { isDel: true });
      if(res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
      return HttpStatus.NO_CONTENT;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
