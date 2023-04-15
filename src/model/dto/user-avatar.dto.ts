import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsNotEmpty } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateUserAvatarDto implements Prisma.UserAvatarUncheckedCreateInput {
  @IsNotEmpty()
  characterName: string;

  @IsNotEmpty()
  inGameId: string;

  @IsNotEmpty()
  rank: string;

  ratingScore: number;

  @IsNotEmpty()
  gameId: string;

  @IsNotEmpty()
  userId: string;

  createdAt: Date;
}

export class UpdateUserAvatarDto extends PartialType(CreateUserAvatarDto) {}

export const schemas = validationMetadatasToSchemas();
