import { getSchemaPath } from "@nestjs/swagger";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { Prisma } from "@prisma/client";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import {
  UserAvatarSchema,
  UserOptionalDefaultsSchema,
  UserPartialSchema,
  UserSchema,
  UserSettingsSchema
} from "model/schema";

import { UserAvatarDto } from "./user-avatar.dto";
import { UserSettingsDto } from "./user-settings.dto";

export class CreateUserDto
  extends createZodDto(UserOptionalDefaultsSchema)
  implements Prisma.UserUncheckedCreateInput {}

export class UpdateUserDto extends createZodDto(UserPartialSchema) {}

export class SecureUserDto
  extends createZodDto(
    UserSchema.omit({
      password: true
    })
  )
  implements Omit<Prisma.UserUncheckedCreateInput, "password"> {}

export class UserValidationResponseDto extends createZodDto(
  z
    .object({
      username: z.boolean(),
      mobilePhone: z.boolean(),
      email: z.boolean()
    })
    .partial()
) {}

export class UserDetailResponseDto extends createZodDto(
  z.object({
    info: UserSchema.omit({
      password: true
    }),
    settings: UserSettingsSchema.nullable(),
    avatars: UserAvatarSchema.array()
  })
) {
  public static toSchemaObject(): SchemaObject {
    return {
      type: "object",
      properties: {
        info: {
          $ref: getSchemaPath(SecureUserDto)
        },
        settings: {
          nullable: true,
          $ref: getSchemaPath(UserSettingsDto)
        },
        avatars: {
          type: "array",
          items: {
            $ref: getSchemaPath(UserAvatarDto)
          }
        }
      }
    };
  }
}
