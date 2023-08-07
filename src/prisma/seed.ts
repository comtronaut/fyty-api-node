import fs from "fs";

import { AdminRole, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { match } from "ts-pattern";
import { AnyFunction } from "tsdef";
import { z } from "zod";

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
    .otherwise(() => null);
}

main(/* () => migrate("user") */ initData)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
