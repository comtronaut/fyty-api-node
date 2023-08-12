import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  async getAllTrainingReportsAsAdmin(@Query() query: Record<string, string> = {}) {
    const { q, page, perPage } = query;

    return await this.trainingService.getAllReports();
  }

  @Get(":id")
  async getTrainingReportByIdAsAdmin(@Param("id") id: string) {
    return await this.trainingService.getReportById(id);
  }

  @Put(":id")
  async updateTrainingReportByIdAsAdmin(
    @Param("id") id: string,
    @Body() payload: UpdateTrainingReportDto
  ) {
    return await this.trainingService.updateReport(id, payload);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrainingReportByIdAsAdmin(@Param("id") id: string): Promise<void> {
    return await this.trainingService.deleteById(id);
  }
}
