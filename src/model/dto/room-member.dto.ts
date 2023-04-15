import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateRoomMemberDto implements Prisma.RoomMemberUncheckedCreateInput {
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}

export const schemas = validationMetadatasToSchemas();
