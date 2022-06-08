import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function getConfig(rawUrl: string): TypeOrmModuleOptions {
  const url = new URL(rawUrl);

  return {
    type: "postgres",
    host: url.hostname,
    port: parseInt(url.port),
    username: url.username,
    password: url.password,
    database: url.pathname.slice(1),
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
