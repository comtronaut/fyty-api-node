import { createZodDto } from "nestjs-zod";

import { RoomSettingsSchema } from "model/schema";

export class UpdateRoomSettingDto extends createZodDto(RoomSettingsSchema.partial()) {}
