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

  ownerId: string;

  createdAt: Date;
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) { }

export class CreateTeamMemberDto {

  role: string;

  @IsNotEmpty()
  teamId: string;

  @IsNotEmpty()
  userId: string;

  joinedAt: Date;

}

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) { }

export class CreateTeamPendingDto {
  @IsNotEmpty()
  teamId: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  status: string;
  
  createdAt: Date;

}

export class UpdateTeamPendingDto extends PartialType(CreateTeamPendingDto) { }
