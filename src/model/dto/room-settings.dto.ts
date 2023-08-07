import { createZodDto } from "nestjs-zod";

import {
  RoomSettingsPartialSchema
} from "model/schema";

export class UpdateRoomSettingDto extends createZodDto(RoomSettingsPartialSchema) {}
