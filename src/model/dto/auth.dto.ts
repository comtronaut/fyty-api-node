import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class OAuthQueryDto extends createZodDto(
  z.object({
    state: z.string(),
    code_challenge: z.string(),
    code_challenge_method: z.string(),
    nonce: z.string()
  }).partial()
) {}

export class LoginUserQueryDto extends createZodDto(
  z.object({
    username: z.string(),
    password: z.string()
  })
) {}

export class LoginAdminQueryDto extends createZodDto(
  z.object({
    email: z.string().email(),
    password: z.string()
  })
) {}
