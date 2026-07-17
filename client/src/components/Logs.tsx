import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { LogEntry } from "../types";

interface LogsProps {
  logs: LogEntry[];
  title?: string;
  limit?: number;
}

const levelStyles = {
  info: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-danger",
} as const;

const levelIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
} as const;

export default function Logs({
  logs,
  title = "Recent activity",
  limit = 5,
}: LogsProps) {
  const visibleLogs = logs.slice(0, limit);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-text-muted">
          {visibleLogs.length} recent
        </span>
      </div>

      {visibleLogs.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface/70 px-4 py-6 text-sm text-text-muted">
          No activity recorded yet.
        </div>
      ) : (
        <div className="space-y-2">
          {visibleLogs.map((entry) => {
            const Icon = levelIcons[entry.level];
            return (
              <div
                key={entry.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface/70 px-3 py-3"
              >
                <div
                  className={`mt-0.5 rounded-full bg-surface p-1 ${levelStyles[entry.level]}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{entry.message}</span>
                    <span className="text-xs uppercase tracking-[0.24em] text-text-muted">
                      {entry.level}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    {entry.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
