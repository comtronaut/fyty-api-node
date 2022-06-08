import nonNull from "non-null";
import { config } from "dotenv";

config();

const env = {
//   DATABASE_URL: grant("DATABASE_URL")
  NODE_ENV: grant("NODE_ENV"),
  POSTGRES_URL: grant("POSTGRES_URL")
} as const;

function grant(envKey: string) {
  return nonNull(process.env[envKey], `${envKey} is missing from env.`);
}

export default env;
