import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAppiontmentDto, UpdateAppiontmentDto } from "src/model/dto/appiontment.dto";
import { Appiontment, AppiontmentMember } from "src/model/sql-entity/appiontment.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class AppiontmentService {
  constructor(
    @InjectRepository(Appiontment) private appiontmentModel: Repository<Appiontment>,
    @InjectRepository(AppiontmentMember) private appiontmentMemberModel: Repository<AppiontmentMember>
  ) { }
  
  // CRUD
  async create(req: CreateAppiontmentDto) {
    try {

    // create appiontment
      const appiontment = this.appiontmentModel.create(req);
      const res = await this.appiontmentModel.save(appiontment);

    // create appiontment member

    for(let i in req.teamIds ){
        const member = this.appiontmentMemberModel.create({ teamId: i, appointId: res.id });
        await this.appiontmentMemberModel.save(member);
    }
      return res;
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAppiontment(roomId: string, teamId: string) {
    try{
        if(roomId){
          return await this.appiontmentModel.findBy({ roomId: roomId, isDel: false });
        }
        if(teamId){
          const appiontments = await this.appiontmentMemberModel.findBy({ teamId: teamId });
          return await this.appiontmentModel.findBy({ id: In (appiontments.map(e => e.appointId )), isDel: false })
        }
        return await this.appiontmentModel.findBy({ isDel: false });
    }
    catch(err){
        throw new BadRequestException(err.message);
    }
  }

  async update(appiontmentId: string, req: UpdateAppiontmentDto) {
    try {
      const updateRes = await this.appiontmentModel.update(appiontmentId, req);

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      return await this.appiontmentModel.findOneOrFail({ where: { id: appiontmentId }});
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(appiontmentId: string) {
    try {
      const res = await this.appiontmentModel.update({ id: appiontmentId }, { isDel: true });
      if(res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
      return HttpStatus.NO_CONTENT;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
