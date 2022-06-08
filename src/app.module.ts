import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import env from './common/env.config';
import { getConfig } from './common/orm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(getConfig(env.POSTGRES_URL)),
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
