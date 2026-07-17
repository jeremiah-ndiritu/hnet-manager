import { CircleAlert, Wifi } from "lucide-react";
import { Card } from "./ui";
import type { HotspotStatus } from "../types";

interface StatusCardProps {
  status: HotspotStatus | null;
  isLoading?: boolean;
}

export default function StatusCard({
  status,
  isLoading = false,
}: StatusCardProps) {
  const availableSlots = Math.max(
    (status?.maxClients ?? 0) - (status?.clients ?? 0),
    0,
  );

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
            Live status
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            Current network summary
          </h2>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-semibold ${status?.started ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}
        >
          {status?.started ? "Running" : "Stopped"}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
          <CircleAlert className="h-4 w-4" />
          Refreshing state...
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface/70 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <Wifi className="h-4 w-4" />
              Network name
            </div>
            <p className="mt-2 text-lg font-semibold">
              {status?.ssid || "Unavailable"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface/70 p-3">
            <div className="text-sm font-medium text-text-muted">
              Connected clients
            </div>
            <p className="mt-2 text-lg font-semibold">{status?.clients ?? 0}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface/70 p-3">
            <div className="text-sm font-medium text-text-muted">Capacity</div>
            <p className="mt-2 text-lg font-semibold">
              {status?.maxClients ?? 0} max
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface/70 p-3">
            <div className="text-sm font-medium text-text-muted">
              Slots available
            </div>
            <p className="mt-2 text-lg font-semibold">{availableSlots}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
