import { Card } from "./ui";
import type { Device, HotspotStatus } from "../types";

interface DeviceTableProps {
  devices: Device[];
  status: HotspotStatus | null;
}

export default function DeviceTable({ devices, status }: DeviceTableProps) {
  const availableSlots = Math.max(
    (status?.maxClients ?? 0) - (status?.clients ?? 0),
    0,
  );

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
            Devices
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            Connected device snapshot
          </h2>
        </div>
        <div className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-muted">
          {status?.started ? "Sharing active" : "Sharing idle"}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface/70 p-3">
          <p className="text-sm text-text-muted">Maximum devices</p>
          <p className="mt-1 text-lg font-semibold">
            {status?.maxClients ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface/70 p-3">
          <p className="text-sm text-text-muted">Connected now</p>
          <p className="mt-1 text-lg font-semibold">{devices.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface/70 p-3">
          <p className="text-sm text-text-muted">Open slots</p>
          <p className="mt-1 text-lg font-semibold">{availableSlots}</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border">
        {devices.length === 0 ? (
          <div className="px-4 py-6 text-sm text-text-muted">
            No devices are currently connected.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-surface/70">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-text-muted">
                  Host
                </th>
                <th className="px-4 py-3 text-left font-medium text-text-muted">
                  IP address
                </th>
                <th className="px-4 py-3 text-left font-medium text-text-muted">
                  MAC
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {devices.map((device) => {
                const details = [device.manufacturer, device.deviceType]
                  .filter(Boolean)
                  .join(" • ");
                return (
                  <tr key={`${device.ip}-${device.mac}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {device.displayName || device.hostname || "Unknown Device"}
                      </div>
                      {details ? (
                        <div className="mt-1 text-xs text-text-muted">{details}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {device.ipAddress || device.ip}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {device.macAddress || device.mac}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
