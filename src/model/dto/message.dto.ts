import { Prisma } from ".prisma/client";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateMessageDto implements Prisma.MessageUncheckedCreateInput {
  @IsOptional()
  waitingKey: string;

  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  @IsNotEmpty()
  @IsUUID()
  senderId: string;

  @IsOptional()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  message: string;
}

export const schemas = validationMetadatasToSchemas();
