import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateMessageDto {
  @IsUUID()
  chatId: string;

  @IsUUID()
  senderId: string;

  @ApiPropertyOptional()
  teamId: string;

  @IsNotEmpty()
  message: string;
}