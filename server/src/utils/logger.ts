// server/src/utils/logger.ts

import { randomUUID } from "crypto";

const MAX_LOGS = 100;

export interface LogEntry {
  id: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: string;
}

const logs: LogEntry[] = [];

export function log(level: LogEntry["level"], message: string) {
  logs.unshift({
    id: randomUUID(),
    level,
    message,
    timestamp: new Date().toLocaleString(),
  });

  if (logs.length > MAX_LOGS) logs.pop();
}

export function getLogs() {
  return logs;
}
