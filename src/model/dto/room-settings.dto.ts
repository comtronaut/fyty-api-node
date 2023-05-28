import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";

import {
  RoomSettingsOptionalDefaultsSchema,
  RoomSettingsPartialSchema
} from "model/schema";

export class CreateRoomSettingDto
  extends createZodDto(RoomSettingsOptionalDefaultsSchema)
  implements Prisma.RoomSettingsUncheckedCreateInput {}

export class UpdateRoomSettingDto extends createZodDto(RoomSettingsPartialSchema) {}
