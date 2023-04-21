import nonNull from "non-null";
import { config } from "dotenv";
import * as fs from "fs";

function loadEnv() {
  process.env["HOST"] === "0.0.0.0"
    ? fs.copyFileSync("env/.env.prod", ".env")
    : fs.copyFileSync("env/.env.dev", ".env");

  config();
}

loadEnv();

const env = {
  NODE_ENV: grant("NODE_ENV"),
  POSTGRES_URL: grant("POSTGRES_URL"),
  JWT_SECRET: grant("JWT_SECRET"),
  JWT_ADMIN_SECRET: grant("JWT_ADMIN_SECRET"),
  SERVER_ORIGIN: grant("SERVER_ORIGIN"),
  CLIENT_ORIGIN: grant("CLIENT_ORIGIN"),

  GOOGLE_CLIENT_ID: grant("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: grant("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: grant("GOOGLE_REDIRECT_URI"),

  FACEBOOK_CLIENT_ID: grant("FACEBOOK_CLIENT_ID"),
  FACEBOOK_CLIENT_SECRET: grant("FACEBOOK_CLIENT_SECRET"),
  FACEBOOK_REDIRECT_URI: grant("FACEBOOK_REDIRECT_URI"),

  LINE_NOTIFY_CLIENT_ID: grant("LINE_NOTIFY_CLIENT_ID"),
  LINE_NOTIFY_CLIENT_SECRET: grant("LINE_NOTIFY_CLIENT_SECRET"),
  LINE_NOTIFY_REDIRECT_URI: grant("LINE_NOTIFY_REDIRECT_URI")
} as const;

function grant(envKey: string) {
  return nonNull(process.env[envKey], `${envKey} is missing from env.`);
}

export default env;
