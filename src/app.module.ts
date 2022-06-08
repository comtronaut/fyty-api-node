import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from "./api/api.module";

@Module({
  imports: [
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
