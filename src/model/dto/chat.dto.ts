import { Prisma } from ".prisma/client";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateMessageDto implements Prisma.MessageUncheckedCreateInput {
  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  @IsNotEmpty()
  @IsUUID()
  senderId: string;

  @ApiPropertyOptional()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
