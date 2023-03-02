import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsString } from "class-validator";

export class CreateUserSettingsDto
implements Prisma.UserSettingsUncheckedCreateInput
{
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  lang: string;
}

export class UpdateUserSettingsDto extends PartialType(CreateUserSettingsDto) {}
