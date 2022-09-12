import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserAvatarDto,UpdateUserAvatarDto } from "src/model/dto/user.dto";
import { UserAvatar } from "src/model/sql-entity/user/userAvatar.entity";
import { User } from "src/model/sql-entity/user/user.entity";

@Injectable()
export class UserAvatarService {
  constructor(
    @InjectRepository(UserAvatar) private avatarModel: Repository<UserAvatar>,
  ) { }
  
  // CRUD
  async createUserAvatar(req: CreateUserAvatarDto) {
    try {
      return await this.avatarModel.save(req);
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getUserAvatar(userId: string, gameId: string) {
    try {
      return await this.avatarModel.findBy({ userId: userId, gameId: gameId });
    }
    catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async getUserAvatarByGameId( gameId:string , user:User) {
    return await this.avatarModel.find({where:{gameId:gameId,userId:user.id}});
  }

  async update(avatarId: string, req: UpdateUserAvatarDto) {
    try {
      const updateRes = await this.avatarModel.update(avatarId, req);

      if (updateRes.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT);
      }

      return await this.avatarModel.findOneOrFail({ where: { id: avatarId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteUserAvatar(avatarId: string) {
    try {
      const res = await this.avatarModel.delete({ id: avatarId });
      if (res.affected === 0) {
        return new HttpException("", HttpStatus.NO_CONTENT)
      }
      console.log(res);
      return;
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

}
