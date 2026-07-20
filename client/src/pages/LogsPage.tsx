import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { wifiApi } from "@/api/wifi";
import { Button, Card, Input } from "@/components/ui";
import type { LogEntry, LogsResponse } from "@/types";
import { useMemo, useState } from "react";

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const logsQuery = useQuery<LogsResponse>({
    queryKey: ["hotspot-logs"],
    queryFn: wifiApi.logs,
    refetchInterval: 10000,
  });

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const logs = logsQuery.data?.logs ?? [];
    if (!query) return logs;
    return logs.filter((entry) =>
      `${entry.message} ${entry.level} ${entry.timestamp}`
        .toLowerCase()
        .includes(query),
    );
  }, [logsQuery.data?.logs, search]);

  return (
    <div className="page py-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
              Activity history
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Full logs</h1>
          </div>
          <Link to="/">
            <Button variant="secondary">
              <span className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </span>
            </Button>
          </Link>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 py-3">
          <Search className="h-4 w-4 text-text-muted" />
          <Input
            aria-label="Search logs"
            placeholder="Search by message, level, or time"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </div>

        {logsQuery.isLoading ? (
          <div className="mt-6 rounded-xl border border-border bg-surface/70 px-4 py-8 text-center text-sm text-text-muted">
            Loading logs@.
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="mt-6 rounded-xl border border-border bg-surface/70 px-4 py-8 text-center text-sm text-text-muted">
            No matching log entries were found.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-surface/70">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">
                    Level
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-text-muted">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {filteredLogs.map((entry: LogEntry) => (
                  <tr key={entry.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                      {entry.timestamp}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium uppercase tracking-[0.24em] text-text-muted">
                      {entry.level}
                    </td>
                    <td className="px-4 py-3">{entry.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
