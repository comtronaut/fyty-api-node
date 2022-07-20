import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "src/model/sql-entity/user/user.entity";

@Injectable()
export class UserAvatarService {
  constructor(
    @InjectRepository(User) private avatarModel: Repository<User>,
  ) { }
  
  // CRUD
//   async createUser(input: Record<string, any>) {
//     try {
//       const [ hashedPassword, hashedPhoneNumber ] = await Promise.all([ // parallel promise
//         bcrypt.hashSync(input.password, 12),
//         bcrypt.hashSync(input.phoneNumber, 12),
//       ]);

//       const { phoneNumber, ...rest } = input;
//       const createdContent = { ...rest, password: hashedPassword };
      
//       await this.phoneNumberModel.save({ phoneNumber: hashedPhoneNumber });
//       const { password, ...userData } = await this.userModel.save(createdContent);
//       return userData;
//     }
//     catch(err) {
//       throw new BadRequestException(err.message);
//     }
//   }

//   async getAllUsers() {
//     return await this.userModel.find();
//   }

//   async updateUser(user: User, input: Record<string, any>) {
//     try {
//       const updateRes = await this.userModel.update(user.id, input);

//       if(updateRes.affected === 0) {
//         return new HttpException("", HttpStatus.NO_CONTENT);
//       }

//       const { password, ...res } = await this.userModel.findOneOrFail({ where: { id: user.id }});
       
//       return res;
//     } catch (err) {
//       throw new BadRequestException(err.message);
//     }
//   }

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
