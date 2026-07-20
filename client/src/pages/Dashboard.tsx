import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { RefreshCw, Radio, Sparkles, Logs as LogsIcon } from "lucide-react";
import toast from "react-hot-toast";
import { wifiApi } from "@/api/wifi";
import { Button, Card, Input } from "@/components/ui";
import DeviceTable from "@/components/DeviceTable";
import Logs from "@/components/Logs";
import StatusCard from "@/components/StatusCard";
import type { DevicesResponse, LogsResponse, StatusResponse } from "@/types";

export default function Dashboard() {
  const [pendingAction, setPendingAction] = useState<"start" | "stop" | null>(
    null,
  );
  const [showRename, setShowRename] = useState(false);
  const [ssid, setSsid] = useState("HNet");
  const [key, setKey] = useState("disconnect");

  const statusQuery = useQuery<StatusResponse>({
    queryKey: ["hotspot-status"],
    queryFn: wifiApi.status,
    refetchInterval: 10000,
  });
  const devicesQuery = useQuery<DevicesResponse>({
    queryKey: ["hotspot-devices"],
    queryFn: wifiApi.devices,
    refetchInterval: 10000,
  });
  const logsQuery = useQuery<LogsResponse>({
    queryKey: ["hotspot-logs"],
    queryFn: wifiApi.logs,
    refetchInterval: 10000,
  });

  const status = statusQuery.data?.data ?? null;
  const devices = devicesQuery.data?.devices ?? [];
  const logs = logsQuery.data?.logs ?? [];

  const handleAction = async (action: "start" | "stop") => {
    setPendingAction(action);
    try {
      const response =
        action === "start" ? await wifiApi.start() : await wifiApi.stop();
      if (response?.success) {
        toast.success(
          response.message ||
            (action === "start" ? "Sharing started." : "Sharing stopped."),
        );
      } else {
        toast.error(response?.message || "The action could not be completed.");
      }
    } catch {
      toast.error("The hotspot service did not respond as expected.");
    } finally {
      await Promise.all([
        statusQuery.refetch(),
        devicesQuery.refetch(),
        logsQuery.refetch(),
      ]);
      setPendingAction(null);
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([
        statusQuery.refetch(),
        devicesQuery.refetch(),
        logsQuery.refetch(),
      ]);
    } catch {
      toast.error("Unable to refresh status right now.");
    }
  };

  const handleRename = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSsid = ssid.trim();
    const normalizedKey = key.trim();

    if (!normalizedSsid) {
      toast.error("Enter a hotspot name before saving.");
      return;
    }

    if (normalizedKey && normalizedKey.length < 8) {
      toast.error("The password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await wifiApi.set({
        ssid: normalizedSsid,
        key: normalizedKey || "disconnect",
      });
      if (response?.success) {
        toast.success(response.message || "Network name updated.");
        setShowRename(false);
      } else {
        toast.error(
          response?.message || "The network name could not be updated.",
        );
      }
    } catch (error) {
      console.error(error)
      toast.error("The hotspot service could not update the network name.");
    } finally {
      await Promise.all([
        statusQuery.refetch(),
        devicesQuery.refetch(),
        logsQuery.refetch(),
      ]);
    }
  };

  return (
    <div className="page py-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
                <Sparkles className="h-4 w-4" />
                HNet Manager
              </div>
              <h1 className="mt-1 text-2xl font-semibold">
                Hotspot and network controls
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm">
            <span className="font-medium">Network:</span>
            <span className="font-semibold">{status?.ssid || "HNet"}</span>
            <span className="text-text-muted">•</span>
            <span
              className={`font-semibold ${status?.started ? "text-success" : "text-warning"}`}
            >
              {status?.started ? "Running" : "Stopped"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            variant="success"
            loading={pendingAction === "start"}
            onClick={() => void handleAction("start")}
          >
            Start Sharing
          </Button>
          <Button
            variant="danger"
            loading={pendingAction === "stop"}
            onClick={() => void handleAction("stop")}
          >
            Stop Sharing
          </Button>
          <Button variant="secondary" onClick={() => void handleRefresh()}>
            <span className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowRename((value) => !value)}
          >
            Change Network Name
          </Button>
          <Link
            to="/logs"
            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition hover:bg-surface"
          >
            <LogsIcon className="h-4 w-4" />
            View full logs
          </Link>
        </div>

        {showRename && (
          <form
            onSubmit={handleRename}
            className="mt-4 rounded-2xl border border-border bg-surface/70 p-4"
          >
            <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
              <div>
                <label
                  className="text-sm font-medium text-text-muted"
                  htmlFor="ssid"
                >
                  Network name
                </label>
                <Input
                  id="ssid"
                  value={ssid}
                  onChange={(event) => setSsid(event.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <label
                  className="text-sm font-medium text-text-muted"
                  htmlFor="key"
                >
                  Password
                </label>
                <Input
                  id="key"
                  value={key}
                  onChange={(event) => setKey(event.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="submit">Save network name</Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowRename(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <StatusCard
            status={status}
            isLoading={statusQuery.isFetching}
            devices={devices}
          />
          <DeviceTable devices={devices} status={status} />
        </div>
        <Card className="p-5">
          <Logs logs={logs} title="Recent activity" limit={8} />
        </Card>
      </div>
    </div>
  );
}
