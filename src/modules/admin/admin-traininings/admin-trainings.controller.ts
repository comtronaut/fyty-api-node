import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { TrainingSource } from "@prisma/client";

import { CreateTrainingBypassDto, UpdateTrainingDto } from "model/dto/training.dto";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { TrainingService } from "modules/team/training.service";

@Controller("admin/trainings")
@UseGuards(AdminJwtAuthGuard)
export class AdminTrainingsController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  async getAll(@Query() query: Record<string, string> = {}) {
    const { q, page, perPage } = query;

    return await this.trainingService.getAll();
  }

  @Post()
  async create(@Body() payload: CreateTrainingBypassDto) {
    return await this.trainingService.createBypass(payload, TrainingSource.ADMIN);
  }

  @Get(":id")
  async getById(@Param("id") trainingId: string) {
    return await this.trainingService.getById(trainingId);
  }

  @Put(":id")
  async updateTeam(@Param("id") trainingId: string, @Body() payload: UpdateTrainingDto) {
    return await this.trainingService.update(trainingId, payload);
  }

  @Delete(":id")
  async deleteTeam(@Param("id") trainingId: string) {
    return await this.trainingService.delete(trainingId);
  }
}
