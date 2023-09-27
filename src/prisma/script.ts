import fs from "fs";

import { AdminRole, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { match } from "ts-pattern";
import { AnyFunction } from "tsdef";
import { z } from "zod";

const prisma = new PrismaClient();

async function run() {
  const rooms = await prisma.room.findMany({
    select: {
      userNotifRegistrations: true,
      members: {
        select: {
          team: {
            select: {
              members: {
                select: {
                  user: {
                    select: { id: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  const toBeDelNotiIds = [] as string[];
  for (const { userNotifRegistrations, members } of rooms) {
    const roomUserIds = members.flatMap((m) => m.team.members.map((m) => m.user.id));
    const a = userNotifRegistrations.filter((m) => !roomUserIds.includes(m.userId)).map((m) => m.id);

    toBeDelNotiIds.push(...a);
  }

  await prisma.notifUserRoomRegistration.deleteMany({
    where: {
      id: { in: toBeDelNotiIds }
    }
  });
}

async function main(fn: AnyFunction) {
  await fn();
}

main(/* () => migrate("user") */ run)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
