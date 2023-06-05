import fs from "fs";

import { AdminRole, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import dayjs from "dayjs";
import { camelCase, compact, noop } from "lodash";
import { match } from "ts-pattern";
import { AnyFunction, Nullable } from "tsdef";
import { z } from "zod";

import { Team, Training } from "model/schema";

const prisma = new PrismaClient();

async function initData() {
  await prisma.game.upsert({
    where: { id: "rov" },
    update: {},
    create: {
      id: "rov",
      name: "Arena of valor",
      teamCap: 2,
      lineupCap: 5,
      logoUrl:
        "https://firebasestorage.googleapis.com/v0/b/fyty-tournament.appspot.com/o/Public%2FGameLogo%2Flogo_rov.png?alt=media&token=d2507fea-1efe-490b-b7b5-ade367b47a87",
      coverUrl:
        "https://firebasestorage.googleapis.com/v0/b/fyty-tournament.appspot.com/o/Public%2FGameCover%2Frov.webp?alt=media&token=2f4812ea-9e98-4a81-969c-8d3f1025ecbd",
      desc: "5v5 MOBA game"
    }
  });

  await prisma.admin.upsert({
    where: {
      email: "admin@fyty-esport.com"
    },
    update: {},
    create: {
      email: "admin@fyty-esport.com",
      password: bcrypt.hashSync("gJFAjijCBM2S1Ly98TFi", 12),
      role: AdminRole.MANAGEMENT
    }
  });

  // await migrate("user");
}

async function recalculateStats() {
  await prisma.teamStats.deleteMany({
    where: {}
  });

  const teams = await prisma.team.findMany({
    where: {},
    select: { id: true }
  });

  await prisma.teamStats.createMany({
    data: teams.map(({ id }) => ({
      teamId: id
    }))
  });

  // after reset
  const trainings = await prisma.training.findMany({
    where: {},
    include: {
      host: true,
      guest: true,
      appointment: true
    }
  });

  for (const [ i, training ] of trainings.entries()) {
    console.log(`completing: ${i + 1}/${trainings.length}`);
    /* await compareAndUpdateParticipants(
      training.host!,
      training.guest!,
      {
        hostLoseCount: null,
        hostWinCount: null
      },
      {
        hostLoseCount: training.hostLoseCount,
        hostWinCount: training.hostWinCount
      }
    );

    await prisma.teamStats.updateMany({
      where: { teamId: { in: compact([ training.host!.id, training.guest!.id ]) } },
      data: {
        trainingMinute: {
          increment: diffMinute(training.appointment.startAt, training.appointment.endAt)
        },
        trainingCount: {
          increment: 1
        }
      }
    }); */
  }
}

/* function diffMinute(
  startAt: Parameters<typeof dayjs>[0],
  endAt: Parameters<typeof dayjs>[0]
): number {
  return Math.abs(dayjs(startAt).diff(dayjs(endAt), "minute"));
}

async function compareAndUpdateParticipants(
  host: Nullable<Team>,
  guest: Nullable<Team>,
  oldRes: Pick<Training, "hostWinCount" | "hostLoseCount">,
  newRes: Pick<Training, "hostWinCount" | "hostLoseCount">
) {
  const fromNull = oldRes.hostWinCount === null && Number.isFinite(newRes.hostLoseCount);

  const isNewHostWin = (newRes.hostWinCount || 0) > (newRes.hostLoseCount || 0);
  const isNewHostLose = (newRes.hostWinCount || 0) < (newRes.hostLoseCount || 0);
  const isNewTie = newRes.hostWinCount === newRes.hostLoseCount;

  if (!fromNull) {
    return;
  }

  const data = {
    completedTrainingCount: {
      increment: 1
    },
    perGameWinCount: {
      increment: (newRes.hostWinCount || 0) - (oldRes.hostWinCount || 0)
    },
    perGameLoseCount: {
      increment: (newRes.hostLoseCount || 0) - (oldRes.hostLoseCount || 0)
    }
  };

  if (isNewTie) {
    await prisma.teamStats.updateMany({
      where: {
        teamId: { in: compact([ host?.id, guest?.id ]) }
      },
      data: {
        tieCount: {
          increment: isNewTie ? 1 : 0
        },
        ...data
      }
    });
  }
  else {
    if (host) {
      await prisma.teamStats.update({
        where: { teamId: host.id },
        data: {
          winCount: {
            increment: !isNewTie && isNewHostWin ? 1 : 0
          },
          loseCount: {
            increment: !isNewTie && isNewHostLose ? 1 : 0
          },
          ...data
        }
      });
    }
    if (guest) {
      await prisma.teamStats.update({
        where: { teamId: guest.id },
        data: {
          winCount: {
            increment: isNewHostWin ? 0 : 1
          },
          loseCount: {
            increment: isNewHostLose ? 0 : 1
          },
          ...data
        }
      });
    }
  }
} */

async function main(fn: AnyFunction) {
  await fn();
}

function prune(str: string) {
  if (str.startsWith("\"") && str.endsWith("\"")) {
    return str.slice(1, -1);
  } else {
    return str;
  }
}

function formatCol(raw: string) {
  return match(raw)
    .with("True", () => true)
    .with("False", () => false)
    .with("NULL", () => null)
    .when(
      () => z.coerce.date().safeParse(raw).success,
      () => new Date(String(raw))
    )
    .otherwise(() => raw);
}

async function migrate(table: string): Promise<void> {
  const raw = fs.readFileSync(`migration/${table}.csv`, "utf8");

  const [ header, ...rows ] = raw.split("\r\n").filter(Boolean);
  const headerCols = header!.split(",");

  const data = rows.map((rawRow) => {
    const colEntries = rawRow
      .split(",")
      .map((col, i) => [ prune(headerCols[i]!), formatCol(prune(col)) ]);

    return Object.fromEntries(colEntries);
  });

  await match(table)
    .with("user", () => prisma.user.createMany({ data }))
    .with("team", () => prisma.team.createMany({ data }))
    .with("team_line_up", () => prisma.teamLineup.createMany({ data }))
    .with("team_member", () => prisma.teamMember.createMany({ data }))
    .with("appointment", () => prisma.appointment.createMany({ data }))
    .with("appointment_member", () => prisma.appointmentMember.createMany({ data }))
    .otherwise(noop);
}

main(() => migrate("user"))
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
