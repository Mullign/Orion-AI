import path from "node:path";

export function getDataDir(): string {
  return (
    process.env.APP_DATA_DIR?.trim() ||
    path.join(process.cwd(), "..", "data")
  );
}

export function sanitizeUsername(username: string): string {
  return username.replace(/[^a-zA-Z0-9_-]/g, "_");
}
