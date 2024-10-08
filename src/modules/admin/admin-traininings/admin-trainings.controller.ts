import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { TrainingSource } from "@prisma/client";

import { createPagination } from "common/utils/pagination";
import { CreateTrainingBypassDto, UpdateTrainingDto } from "model/dto/training.dto";
import { AdminJwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { TrainingService } from "modules/team/services/training.service";

@Controller("admin/trainings")
@UseGuards(AdminJwtAuthGuard)
export class AdminTrainingsController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  async getAllTrainingsAsAdmin(
    @Query("page") page?: string,
    @Query("perPage") perPage?: string
  ) {
    return await this.trainingService.getFilter({
      ...createPagination(page, perPage),
      clause: {}
    });
  }

  @Post()
  async createTrainingAsAdmin(@Body() payload: CreateTrainingBypassDto) {
    return await this.trainingService.createBypass(payload, TrainingSource.ADMIN);
  }

  @Get(":id")
  async getTrainingByIdAsAdmin(@Param("id") id: string) {
    return await this.trainingService.getById(id);
  }

  @Put(":id")
  async updateTrainingByIdAsAdmin(
    @Param("id") id: string,
    @Body() payload: UpdateTrainingDto
  ) {
    return await this.trainingService.update(id, payload);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrainingByIdAsAdmin(@Param("id") id: string): Promise<void> {
    return await this.trainingService.deleteById(id);
  }
}
