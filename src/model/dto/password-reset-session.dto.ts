import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsISO8601, IsString } from "class-validator";

export class CreatePasswordResetSessionDto
implements Prisma.PasswordResetSessionUncheckedCreateInput
{
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  token: string;

  @IsISO8601()
  @ApiProperty()
  expiredAt: Date;
}

export class UpdatePasswordResetSessionDto extends PartialType(
  CreatePasswordResetSessionDto
) {}
