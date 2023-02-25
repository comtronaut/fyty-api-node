import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateMessageDto } from "src/model/dto/chat.dto";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async getMesssagesFromChatId(chatId: string) {
    try {
      return await this.prisma.message.findMany({ where: { chatId } });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(dto: CreateMessageDto) {
    return await this.prisma.message.create({ data: dto });
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
