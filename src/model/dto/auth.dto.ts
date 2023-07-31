import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class OAuthQueryDto extends createZodDto(
  z
    .object({
      state: z.string(),
      code_challenge: z.string(),
      code_challenge_method: z.string(),
      nonce: z.string()
    })
    .partial()
) {}

export class AccessTokenDto extends createZodDto(
  z.object({
    accessToken: z.string()
  })
) {}
