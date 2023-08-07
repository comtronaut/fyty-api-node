import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";

import { UpdateTrainingReportDto } from "model/dto/training-report.dto";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { TrainingService } from "modules/team/services/training.service";

@Controller("admin/reports")
@UseGuards(AdminJwtAuthGuard)
export class AdminReportsController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  async getAll(@Query() query: Record<string, string> = {}) {
    const { q, page, perPage } = query;

    return await this.trainingService.getAllReports();
  }

  @Put(":id")
  async updateTeam(
    @Param("id") reportId: string,
    @Body() payload: UpdateTrainingReportDto
  ) {
    return await this.trainingService.updateReport(reportId, payload);
  }

  @Delete(":id")
  async deleteTeam(@Param("id") reportId: string) {
    return await this.trainingService.deleteById(reportId);
  }
}
