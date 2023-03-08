import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { Admin } from '@prisma/client';
import { AdminJwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateAdminDto, UpdateAdminDto } from 'src/model/dto/admin.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly addminService: AdminService) { }

    @Post()
    async createAdminAccount(@Body() payload: CreateAdminDto) {
        return await this.addminService.createAdmin(payload);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get()
    async getAllAdmin(){
        return await this.addminService.getAllAdmin();
    }

    @UseGuards(AdminJwtAuthGuard)
    @Get(":id")
    async getAdmin(@Param("id") adminId: Admin["id"]){
        return await this.addminService.getAdminById(adminId);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Put(":id")
    async updateAdminData(
        @Param("id") adminId: Admin["id"],
        @Body() payload: UpdateAdminDto
    ){
        return await this.addminService.updateAdminData(adminId, payload);
    }

    @UseGuards(AdminJwtAuthGuard)
    @Delete(":id")
    async deleteAdmin(@Param("id") adminId:Admin["id"]){
        return await this.addminService.deleteAdmin(adminId);
    }
}
