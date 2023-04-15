import { PartialType } from "@nestjs/mapped-types";
import { PendingStatus, Prisma } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateTeamPendingDto
implements Prisma.TeamPendingUncheckedCreateInput
{
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsEnum(PendingStatus)
  status: PendingStatus;
}

export class UpdateTeamPendingDto extends PartialType(CreateTeamPendingDto) {}

export const schemas = validationMetadatasToSchemas();
