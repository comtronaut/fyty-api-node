import { Controller, Param, Post } from "@nestjs/common";
import { Debug } from "src/common/debug.decorator";
import { DebugService } from "./debug.service";

@Controller("api/debug")
export class DebugController {
  constructor(private readonly debugService: DebugService) {}

  @Post("migrate/:table")
  @Debug()
  async migrateUsers(@Param("table") tableName: string) {
    return await this.debugService.migrate(tableName);
  }
}
