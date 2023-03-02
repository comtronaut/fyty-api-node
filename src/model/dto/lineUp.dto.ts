import { PartialType } from "@nestjs/mapped-types";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsUUID } from "class-validator";

export class CreateLineUpDto implements Prisma.TeamLineUpUncheckedCreateInput {
  @IsUUID()
  teamId: string;

  @ApiPropertyOptional()
  isDefault: any;

  @ApiPropertyOptional()
  inGameId: string;

  @ApiPropertyOptional()
  imageUrl: string;
}

export class UpdateLineUpDto extends PartialType(CreateLineUpDto) {}
