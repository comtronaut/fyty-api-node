import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsISO8601, IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreatePasswordResetSessionDto
implements Prisma.PasswordResetSessionUncheckedCreateInput
{
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  token: string;

  @IsISO8601()
  expiredAt: Date;
}

export class UpdatePasswordResetSessionDto extends PartialType(
  CreatePasswordResetSessionDto
) {}

export const schemas = validationMetadatasToSchemas();
