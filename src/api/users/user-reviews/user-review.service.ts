import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "src/model/sql-entity/user/user.entity";
import { UpdateUserDto } from "src/model/dto/user.dto";

@Injectable()
export class UserReviewService {
  constructor(
    @InjectRepository(User) private userModel: Repository<User>,
  ) { }
  
  async updateRatingScore(user: User, req: UpdateUserDto) {
    try {
      const updateRes = await this.userModel.update(user.id, req);

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      const { password, ...res } = await this.userModel.findOneOrFail({ where: { id: user.id }});
       
      return res;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
