import { IsNotEmpty, IsUrl, IsUUID } from "class-validator";

export class CreateRoomRequestDto {
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  // @IsNotEmpty()
  teamlineUpIds: string;
}
