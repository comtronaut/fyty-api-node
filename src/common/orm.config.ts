import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function getConfig(rawUrl: string): TypeOrmModuleOptions {
  const url = new URL(rawUrl);

  return {
    type: "postgres",
    url: rawUrl,
    entities: [ `${__dirname}/../**/*.entity{.ts,.js}` ],
    synchronize: true,
    ...(url.hostname === "localhost" ? {} : {
      extra: {
        connectionLimit: 10,
        ssl: {
          rejectUnauthorized: false
        }
      }
    })
  };
}
