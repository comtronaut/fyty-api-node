import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { RoomPendingOptionalDefaultsSchema } from "model/schema";

export class CreateRoomPendingDto
  extends createZodDto(
    RoomPendingOptionalDefaultsSchema.extend({
      teamLineupIds: z.string().array().nonempty()
    })
  )
  implements Prisma.RoomPendingUncheckedCreateInput {}
