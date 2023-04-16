import { AdminRole, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
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
