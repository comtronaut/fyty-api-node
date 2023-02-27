import nonNull from "non-null";
import { config } from "dotenv";
import * as fs from "fs";

function loadEnv() {
  process.env["NODE_ENV"] === "production"
    ? fs.copyFileSync("env/.env.prod", ".env")
    : fs.copyFileSync("env/.env.dev", ".env");

  config();
}

loadEnv();

const env = {
  NODE_ENV: grant("NODE_ENV"),
  POSTGRES_URL: grant("POSTGRES_URL"),
  JWT_SECRET: grant("JWT_SECRET"),

  GOOGLE_CLIENT_ID: grant("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: grant("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: grant("GOOGLE_REDIRECT_URI"),

  FACEBOOK_CLIENT_ID: grant("FACEBOOK_CLIENT_ID"),
  FACEBOOK_CLIENT_SECRET: grant("FACEBOOK_CLIENT_SECRET"),
  FACEBOOK_REDIRECT_URI: grant("FACEBOOK_REDIRECT_URI"),

  FIREBASE_API_KEY: grant("FIREBASE_API_KEY"),
  FIREBASE_AUTH_DOMAIN: grant("FIREBASE_AUTH_DOMAIN"),
  FIREBASE_PROJECT_ID: grant("FIREBASE_PROJECT_ID"),
  FIREBASE_STORAGE_BUCKET: grant("FIREBASE_STORAGE_BUCKET"),
  FIREBASE_MESSAGING_SENDER_ID: grant("FIREBASE_MESSAGING_SENDER_ID"),
  FIREBASE_APP_ID: grant("FIREBASE_APP_ID")
} as const;

function grant(envKey: string) {
  return nonNull(process.env[envKey], `${envKey} is missing from env.`);
}

export default env;
