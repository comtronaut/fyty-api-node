import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { PhoneNumber } from "src/model/sql-entity/phoneNumber.entity";
import { User } from "src/model/sql-entity/user/user.entity";
import { CreateUserDto, UpdateUserDto } from "src/model/dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userModel: Repository<User>,
    @InjectRepository(PhoneNumber) private readonly phoneNumberModel: Repository<PhoneNumber>,
  ) { }
  
  // CRUD
  async create(req: CreateUserDto) {
    try {
      const [ hashedPassword, hashedPhoneNumber ] = await Promise.all([ // parallel promise
        bcrypt.hashSync(req.password, 12),
        bcrypt.hashSync(req.phoneNumber, 12),
      ]);

      const { phoneNumber, ...rest } = req;
      const createdContent = { ...rest, password: hashedPassword };
      
      await this.phoneNumberModel.save({ phoneNumber: hashedPhoneNumber });
      const { password, ...userData } = await this.userModel.save(createdContent);
      return userData;
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(user: User, req: UpdateUserDto) {
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

  async delete(id: string) {
    try {
      const res = await this.userModel.delete(id);
      if(res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
