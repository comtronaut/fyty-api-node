import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateRoomSettingDto implements Prisma.RoomSettingsUncheckedCreateInput {
  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}

export class UpdateRoomSettingDto extends PartialType(CreateRoomSettingDto) {}

export const schemas = validationMetadatasToSchemas();
