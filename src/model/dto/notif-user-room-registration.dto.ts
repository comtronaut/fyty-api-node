import { createZodDto } from "nestjs-zod";

import {
  NotifUserRoomRegistrationPartialSchema,
  NotifUserRoomRegistrationSchema
} from "model/schema";

export class NotifUserRoomRegistrationDto extends createZodDto(
  NotifUserRoomRegistrationSchema
) {}

export class UpdateNotifUserRoomRegistrationDto extends createZodDto(
  NotifUserRoomRegistrationPartialSchema
) {}
