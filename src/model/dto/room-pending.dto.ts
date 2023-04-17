import { Prisma } from "@prisma/client";
import { IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateRoomPendingDto implements Prisma.RoomPendingUncheckedCreateInput {
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsArray()
  teamLineupIds: string[];
}

export const schemas = validationMetadatasToSchemas();
