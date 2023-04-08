import { Injectable } from "@nestjs/common";
import fs from "fs";
import { PrismaService } from "src/services/prisma.service";

@Injectable()
export class DebugService {
  constructor(private readonly prisma: PrismaService) {}

  private prune(str: string) {
    if (str.startsWith("\"") && str.endsWith("\"")) {
      return str.slice(1, -1);
    } else {
      return str;
    }
  }

  private formatCol(raw: string, table: string) {
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

  async migrate(table: string): Promise<void> {
    const raw = fs.readFileSync(`migration/${table}.csv`, "utf8");

    const [ header, ...rows ] = raw.split("\r\n").filter(Boolean);
    const headerCols = header.split(",");

    const formattedRow = rows.map((rawRow) => {
      const colEntries = rawRow.split(",").map((col, i) => {
        return [
          this.prune(headerCols[i]),
          this.formatCol(this.prune(col), table)
        ];
      });

      return Object.fromEntries(colEntries);
    });

    if (table === "user") {
      await this.prisma.user.createMany({
        data: formattedRow
      });
    } else if (table === "team") {
      await this.prisma.team.createMany({
        data: formattedRow
      });
    } else if (table === "team_line_up") {
      await this.prisma.teamLineUp.createMany({
        data: formattedRow
      });
    } else if (table === "team_member") {
      await this.prisma.teamMember.createMany({
        data: formattedRow
      });
    } else if (table === "appointment") {
      await this.prisma.appointment.createMany({
        data: formattedRow
      });
    } else if (table === "appointment_member") {
      await this.prisma.appointmentMember.createMany({
        data: formattedRow
      });
    }
  }
}
