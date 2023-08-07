import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  NotifUserRoomRegistrationSchema,
  NotificationActionSchema,
  NotificationSchema
} from "model/schema";

export class NotificationDto extends createZodDto(NotificationSchema) {}

export class UpdateNotificationDto extends createZodDto(
  NotificationActionSchema.pick({
    response: true
  }).required()
) {}

export class NotificationPackResponseDto extends createZodDto(
  z.object({
    receivingNotifications: NotificationSchema.extend({
      action: NotificationActionSchema.nullable()
    }).array(),
    roomNotifRegistrations: NotifUserRoomRegistrationSchema.array()
  })
) {}
