import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Debug } from "src/common/debug.decorator";
import { AppiontmentService } from "./appiontment.service";
import { CreateAppiontmentDto, UpdateAppiontmentDto } from "src/model/dto/appiontment.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller("api/appiontments")
export class AppiontmentController {
  constructor(private readonly appiontmentService: AppiontmentService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() req: CreateAppiontmentDto) {
    return this.appiontmentService.create(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(
    @Param("roomId") roomId: string,
    @Param("teamId") teamId: string
  ) {
    return this.appiontmentService.getAppiontment(roomId, teamId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id") appiontmentId: string, 
    @Body() req: UpdateAppiontmentDto,
    ) {
    return await this.appiontmentService.update(appiontmentId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(
    @Param("id") appiontmentId: string
    ) {    
    return await this.appiontmentService.delete(appiontmentId);
  }
}
