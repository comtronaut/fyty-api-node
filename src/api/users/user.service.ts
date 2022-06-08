import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";

import { PhoneNumber } from "src/model/sql-entity/phoneNumber.entity";
import { User } from "src/model/sql-entity/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userModel: Repository<User>,
    @InjectRepository(PhoneNumber) private readonly phoneNumberModel: Repository<PhoneNumber>,
  ) { }
  
  // CRUD
  async createUser(input: Record<string, any>) {
    try {
      const [ hashedPassword, hashedPhoneNumber ] = await Promise.all([ // parallel promise
        bcrypt.hashSync(input.password, 12),
        bcrypt.hashSync(input.phoneNumber, 12),
      ]);

      const { phoneNumber, ...rest } = input;
      const createdContent = { ...rest, password: hashedPassword };
      
      await this.phoneNumberModel.save({ phoneNumber: hashedPhoneNumber });
      const { password, ...userData } = await this.userModel.save(createdContent);
      return userData;
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getAllUsers() {
    return await this.userModel.find();
  }

  async updateUser(user: User, input: Record<string, any>) {
    try {
      const updateRes = await this.userModel.update(user.id, input);

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      const { password, ...res } = await this.userModel.findOneOrFail({ where: { id: user.id }});
       
      return res;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // async deleteUser(id: string) {
  //   try {
  //     const res = await this.userModel.delete(id);
  //     if(res.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT)
  //     }
  //     return
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }
}
