import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type RuntimeAuth = {
  authSecret: string;
  username: string;
  password: string;
};

function parseEnvFile(content: string): Record<string, string> {
  const values: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

export function getRuntimeEnvPath(): string {
  const dataDir =
    process.env.APP_DATA_DIR?.trim() ||
    path.join(process.cwd(), "..", "data");

  return path.join(dataDir, "runtime.env");
}

function readFromFile(): Partial<RuntimeAuth> | null {
  const filePath = getRuntimeEnvPath();
  if (!existsSync(filePath)) return null;

  const vars = parseEnvFile(readFileSync(filePath, "utf8"));

  return {
    authSecret: vars.AUTH_SECRET,
    username: vars.APP_USERNAME,
    password: vars.APP_PASSWORD,
  };
}

function readFromProcessEnv(): Partial<RuntimeAuth> {
  return {
    authSecret: process.env.AUTH_SECRET?.trim(),
    username: process.env.APP_USERNAME?.trim(),
    password: process.env.APP_PASSWORD?.trim(),
  };
}

export function readRuntimeAuth(): RuntimeAuth | null {
  const fileAuth = readFromFile();
  const envAuth = readFromProcessEnv();

  const authSecret = envAuth.authSecret || fileAuth?.authSecret;
  const username = envAuth.username || fileAuth?.username;
  const password = envAuth.password || fileAuth?.password;

  if (!authSecret || !username || !password) {
    return null;
  }

  return { authSecret, username, password };
}

export function isAuthConfigured(): boolean {
  return readRuntimeAuth() !== null;
}

export function ensureAuthSecret(): string {
  const existing = readRuntimeAuth()?.authSecret || readFromFile()?.authSecret;

  if (existing) {
    process.env.AUTH_SECRET = existing;
    return existing;
  }

  const authSecret = randomBytes(32).toString("hex");
  const filePath = getRuntimeEnvPath();
  mkdirSync(path.dirname(filePath), { recursive: true });

  let content = "";
  if (existsSync(filePath)) {
    content = readFileSync(filePath, "utf8");
  }

  if (!content.includes("AUTH_SECRET=")) {
    content = `${content.trim()}\nAUTH_SECRET=${authSecret}\n`.trimStart();
    writeFileSync(filePath, `${content}\n`, { mode: 0o600 });
  }

  process.env.AUTH_SECRET = authSecret;
  return authSecret;
}

export function saveRuntimeAuth(username: string, password: string): RuntimeAuth {
  const authSecret = ensureAuthSecret();
  const filePath = getRuntimeEnvPath();
  mkdirSync(path.dirname(filePath), { recursive: true });

  const content = `AUTH_SECRET=${authSecret}\nAPP_USERNAME=${username}\nAPP_PASSWORD=${password}\n`;
  writeFileSync(filePath, content, { mode: 0o600 });

  process.env.AUTH_SECRET = authSecret;
  process.env.APP_USERNAME = username;
  process.env.APP_PASSWORD = password;

  return { authSecret, username, password };
}
