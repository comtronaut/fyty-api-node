import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateMessageDto } from "src/model/dto/chat.dto";
import { Chat } from "src/model/sql-entity/chat.entity";
import { Message } from "src/model/sql-entity/message.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageModel: Repository<Message>,
  ) { }

  async getMesssagesFromChatId(chatId: string) {
    try {
      return await this.messageModel.find({ where: { chatId } });
    } catch(err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(dto: CreateMessageDto) {
    return await this.messageModel.save(dto);
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
