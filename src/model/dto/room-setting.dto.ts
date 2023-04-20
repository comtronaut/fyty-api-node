import { PartialType } from "@nestjs/mapped-types";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsUUID } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export class CreateRoomSetting implements Prisma.RoomSettingUncheckedCreateInput {
    @IsNotEmpty()
    @IsUUID()
    roomId: string
}

export class UpdateRoomSetting extends PartialType(CreateRoomSetting) {
    @IsNotEmpty()
    @IsUUID()
    id: string
}

export const schemas = validationMetadatasToSchemas();