import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  AppointmentSchema,
  NotifUserRoomRegistrationSchema,
  NotificationActionSchema,
  NotificationSchema,
  RoomMemberSchema,
  RoomPendingSchema,
  RoomSchema
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
    roomNotifRegistrations: NotifUserRoomRegistrationSchema.array(),
    meNotifyingCount: z.number().nonnegative().int(),
    roomMessageNotifyingCount: z.number().nonnegative().int(),
    teamNotifyingCount: z.number().nonnegative().int()
  })
) {}

export class NotificationOnHostingRoomsResponseDto extends createZodDto(
  RoomSchema.extend({
    appointment: AppointmentSchema,
    members: RoomMemberSchema.array(),
    pendings: RoomPendingSchema.array()
  }).array()
) {}
