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
    @InjectRepository(PhoneNumber) private phoneNumberModel: Repository<PhoneNumber>
  ) { }
  
  // CRUD
  async getUserById(id: string) {
    return await this.userModel.findOneOrFail({ where: { id } });
  }

  async searchUsers(searchString: string, teamId: string) {
    return await this.userModel.createQueryBuilder("user")
      .where("user.displayName like :displayName OR user.username like :username", { displayName: `%${searchString}%`, username: `%${searchString}%` })
      .getMany();
  }

  async create(req: CreateUserDto) {
    try {
      const [ hashedPassword, hashedPhoneNumber ] = await Promise.all([ // parallel promise
        bcrypt.hashSync(req.password, 12),
        bcrypt.hashSync(req.phoneNumber, 12)
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
      const { password, phoneNumber, ...updateData } = req;
      const updateRes = await this.userModel.update(user.id, updateData);

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      const res = await this.userModel.findOneByOrFail({ id: user.id });
      const flatten = (userInfo: User) => {
        const { password, ...rest } = userInfo;
        return rest; 
      }

      return flatten(res);

    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updatePassword(user: User, password: string){
    try {
      const hashedPassword = bcrypt.hashSync(password, 12)
      const updateRes = await this.userModel.update(user.id, { password: hashedPassword });

      if(updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }
       
      return HttpStatus.OK;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(id: string) {
    try {
      const res = await this.userModel.delete(id);
      if(res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getDuplicationResult(payload: UpdateUserDto): Promise<Record<string, boolean>> {
    const res = {} as Record<string, boolean>;

    for (const [ key, value ] of Object.entries(payload)) {
      res[key] = Boolean(await this.userModel.findOne({ where: { [key]: value }}));
    }
    
    return res;
  }
}
