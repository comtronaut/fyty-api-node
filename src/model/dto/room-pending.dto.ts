import { Prisma } from "@prisma/client";

import { RoomPendingOptionalDefaultsSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class CreateRoomPendingDto
  extends createZodDto(
    RoomPendingOptionalDefaultsSchema.merge(
      z.object({
        teamLineupIds: z.string().array().nonempty()
      })
    )
  )
  implements Prisma.RoomPendingUncheckedCreateInput {}
