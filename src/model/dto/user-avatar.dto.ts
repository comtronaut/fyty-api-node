import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateUserAvatarDto implements Prisma.UserAvatarUncheckedCreateInput {
  @IsNotEmpty()
  characterName: string;

  @IsNotEmpty()
  inGameId: string;

  @IsNotEmpty()
  rank: string;

  @IsNotEmpty()
  ratingScore: number;

  @IsNotEmpty()
  gameId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class UpdateUserAvatarDto extends PartialType(CreateUserAvatarDto) {}

export const schemas = validationMetadatasToSchemas();
