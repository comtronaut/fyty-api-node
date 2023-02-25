import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateTeamDto implements Prisma.TeamUncheckedCreateInput {
  @IsNotEmpty()
  name: string;

  coverUrl: string;

  logoUrl: string;

  lineupCount: number;

  @IsUUID()
  gameId: string;

  // @IsNotEmpty()
  ownerId: string;
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @IsNotEmpty()
  id: string;
}

export class CreateTeamMemberDto
implements Prisma.TeamMemberUncheckedCreateInput
{
  role: string;

  @IsNotEmpty()
  teamId: string;

  @IsNotEmpty()
  userId: string;
}

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}

export class CreateTeamPendingDto
implements Prisma.TeamPendingUncheckedCreateInput
{
  @IsNotEmpty()
  teamId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  status: string;
}

export class UpdateTeamPendingDto extends PartialType(CreateTeamPendingDto) {}
