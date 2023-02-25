import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat } from "src/model/sql-entity/chat.entity";
import { Message } from "src/model/sql-entity/message.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private chatModel: Repository<Chat>) {}

  // CRUD
  async create(req: Record<string, any>) {
    try {
      return await this.chatModel.save(req);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  // async update(gameId: string, req: object) {
  //   try {
  //     const updateRes = await this.gameModel.update(gameId, req);

  //     if(updateRes.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT);
  //     }

  //     return await this.gameModel.findOneOrFail({ where: { id: gameId }});
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // async delete(gameId: string) {
  //   try {
  //     const res = await this.gameModel.delete(gameId);
  //     if(res.affected === 0) {
  //       return new HttpException("", HttpStatus.NO_CONTENT)
  //     }
  //     return;
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }
}
