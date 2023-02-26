import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateParticipantDto
implements Prisma.RoomParticipantUncheckedCreateInput
{
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsUUID()
  gameId: string;

  @IsNotEmpty()
  @IsUUID()
  roomLineUpBoardId: string;
}
