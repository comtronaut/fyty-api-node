import { Prisma } from ".prisma/client";

import { MessageOptionalDefaultsSchema } from "model/schema";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class CreateMessageDto
  extends createZodDto(
    MessageOptionalDefaultsSchema.merge(
      z.object({
        waitingKey: z.string().optional()
      })
    )
  )
  implements Prisma.MessageUncheckedCreateInput {}
