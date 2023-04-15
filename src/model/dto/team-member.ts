import { PartialType } from "@nestjs/mapped-types";
import { MemberRole, Prisma } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateTeamMemberDto implements Prisma.TeamMemberUncheckedCreateInput {
  @IsOptional()
  @IsEnum(MemberRole)
  role: MemberRole;

  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}

export const schemas = validationMetadatasToSchemas();
