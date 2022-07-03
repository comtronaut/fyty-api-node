import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateTeamDto {
  @IsNotEmpty()
  name: string;

  coverUrl: string;

  logoUrl: string;

  lineupCount: number;

  @IsNotEmpty()
  gameId: string;

  joinedNumber: number;

  ownerId: string;

  createdAt: Date;
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) { }

export class CreateTeamMemberDto {
  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  teamId: string;

  @IsNotEmpty()
  userId: string;
}

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) { }
