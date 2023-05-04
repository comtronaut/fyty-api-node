import { Prisma } from "@prisma/client";

import {
  RoomSettingsOptionalDefaultsSchema,
  RoomSettingsPartialSchema
} from "model/schema";
import { createZodDto } from "nestjs-zod";

export class CreateRoomSettingDto
  extends createZodDto(RoomSettingsOptionalDefaultsSchema)
  implements Prisma.RoomSettingsUncheckedCreateInput {}

export class UpdateRoomSettingDto extends createZodDto(RoomSettingsPartialSchema) {}
