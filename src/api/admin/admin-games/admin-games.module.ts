import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { GamesController } from './admin-games.controller';
import { AdminGamesService } from './admin-games.service';

@Module({
  controllers: [GamesController],
  providers: [AdminGamesService, PrismaService]
})
export class AdminGamesModule {}
