import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { ChatSchema, MessageSchema, TeamSchema, UserSchema } from "model/schema";

export class ChatDetailResponseDto extends createZodDto(
  z.object({
    chat: ChatSchema,
    messages: MessageSchema.array(),
    chatUsers: UserSchema.array(),
    chatTeams: TeamSchema.array()
  })
) {}
