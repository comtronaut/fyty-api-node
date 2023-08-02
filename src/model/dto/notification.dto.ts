import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  NotifUserRoomRegistrationSchema,
  NotificationPartialSchema,
  NotificationSchema
} from "model/schema";

export class NotificationDto extends createZodDto(NotificationSchema) {}

export class UpdateNotificationDto extends createZodDto(NotificationPartialSchema) {}

export class NotificationPackResponseDto extends createZodDto(
  z.object({
    receivingNotifications: NotificationSchema.array(),
    roomNotifRegistrations: NotifUserRoomRegistrationSchema.array()
  })
) {}
