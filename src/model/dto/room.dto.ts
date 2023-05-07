import { Prisma } from "@prisma/client";

import { RoomOptionalDefaultsSchema, RoomPartialSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class CreateRoomDto
  extends createZodDto(
    RoomOptionalDefaultsSchema.extend({
      teamLineupIds: z.string().cuid().array()
    })
  )
  implements Prisma.RoomUncheckedCreateInput {}

export class UpdateRoomDto extends createZodDto(RoomPartialSchema) {}

export class DeleteRoomDto extends createZodDto(
  z.object({
    roomId: z.string().cuid(),
    teamId: z.string().cuid()
  })
) {}
