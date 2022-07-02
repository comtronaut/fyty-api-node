import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateMessageDto {
  @IsUUID()
  chatId: string;

  @IsUUID()
  senderId: string;

  @IsNotEmpty()
  message: string;
}