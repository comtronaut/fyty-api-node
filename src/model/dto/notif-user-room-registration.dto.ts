import { createZodDto } from "nestjs-zod";

import { NotifUserRoomRegistrationSchema } from "model/schema";

export class NotifUserRoomRegistrationDto extends createZodDto(
  NotifUserRoomRegistrationSchema
) {}
