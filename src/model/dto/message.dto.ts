import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { MessageOptionalDefaultsSchema } from "model/schema";

export class CreateMessageDto
  extends createZodDto(
    MessageOptionalDefaultsSchema.extend({
      waitingKey: z.string().optional()
    })
  )
  implements Prisma.MessageUncheckedCreateInput {}
