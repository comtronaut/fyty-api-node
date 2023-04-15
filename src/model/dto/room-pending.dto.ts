import { Prisma } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateRoomPendingDto implements Prisma.RoomPendingUncheckedCreateInput {
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.split(","))
  teamLineupIds: string[];
}

export const schemas = validationMetadatasToSchemas();
