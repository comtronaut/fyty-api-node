import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateRoomRequestDto
implements Prisma.RoomRequestUncheckedCreateInput
{
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsUUID()
  roomLineUpBoardId: string;

  // @IsNotEmpty()
  teamlineUpIds: string;
}
