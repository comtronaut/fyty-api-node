import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    PrismaService
  ]
})
export class AdminModule {}
