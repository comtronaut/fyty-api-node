import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateRoomSettingDTO implements Prisma.RoomSettingsUncheckedCreateInput {
    @IsNotEmpty()
    @IsUUID()
    roomId: string
}

export class UpdateRoomSettingDTO extends PartialType(CreateRoomSettingDTO) {
    @IsNotEmpty()
    @IsUUID()
    id: string
}

export const schemas = validationMetadatasToSchemas();