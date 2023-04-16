import { AdminRole, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
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

function prune(str: string) {
  if (str.startsWith("\"") && str.endsWith("\"")) {
    return str.slice(1, -1);
  } else {
    return str;
  }
}

function formatCol(raw: string, table: string) {
  if (raw.startsWith("202")) {
    return new Date(raw);
  } else if (raw === "NULL") {
    return null;
  } else if (raw === "True") {
    return true;
  } else if (raw === "False") {
    return false;
  } else {
    return raw;
  }
}

async function migrate(table: string): Promise<void> {
  const raw = fs.readFileSync(`migration/${table}.csv`, "utf8");

  const [ header, ...rows ] = raw.split("\r\n").filter(Boolean);
  const headerCols = header.split(",");

  const formattedRow = rows.map((rawRow) => {
    const colEntries = rawRow.split(",").map((col, i) => {
      return [ prune(headerCols[i]), formatCol(prune(col), table) ];
    });

    return Object.fromEntries(colEntries);
  });

  if (table === "user") {
    await prisma.user.createMany({
      data: formattedRow
    });
  } else if (table === "team") {
    await prisma.team.createMany({
      data: formattedRow
    });
  } else if (table === "team_line_up") {
    await prisma.teamLineup.createMany({
      data: formattedRow
    });
  } else if (table === "team_member") {
    await prisma.teamMember.createMany({
      data: formattedRow
    });
  } else if (table === "appointment") {
    await prisma.appointment.createMany({
      data: formattedRow
    });
  } else if (table === "appointment_member") {
    await prisma.appointmentMember.createMany({
      data: formattedRow
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
