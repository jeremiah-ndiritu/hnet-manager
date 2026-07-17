// server/src/utils/logger.ts

const MAX_LOGS = 100;

export interface LogEntry {
  level: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: string;
}

const logs: LogEntry[] = [];

export function log(level: LogEntry["level"], message: string) {
  logs.unshift({
    level,
    message,
    timestamp: new Date().toLocaleTimeString(),
  });

  if (logs.length > MAX_LOGS) logs.pop();
}

export function getLogs() {
  return logs;
}
