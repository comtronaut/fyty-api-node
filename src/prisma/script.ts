import fs from "fs";

import { AdminRole, PrismaClient, TrainingSource, TrainingStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import dayjs from "dayjs";
import { match } from "ts-pattern";
import { AnyFunction } from "tsdef";
import { z } from "zod";

const prisma = new PrismaClient();

async function run() {
  const nextToBeRemovedTime = dayjs().add(-1, "day").toDate();
  const eventTrainings = await prisma.training.findMany({
    where: {
      appointment: {
        eventRound: {
          eventId: "cln0999r70005mn01kqppvcjg"
        }
      },
      isSubmitted: false,
      status: TrainingStatus.EXPIRED,
      source: TrainingSource.SYSTEM
    },
    select: {
      id: true
    }
  });
  
  console.log(eventTrainings);
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
