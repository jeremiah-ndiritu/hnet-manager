import { api } from "./client";
import type {
  ActionResponse,
  DevicesResponse,
  LogsResponse,
  StatusResponse,
} from "@/types";

async function unwrap<T>(request: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const wifiApi = {
  status: () =>
    unwrap<StatusResponse>(api.get<StatusResponse>("/hotspot/status")),
  devices: () =>
    unwrap<DevicesResponse>(api.get<DevicesResponse>("/hotspot/devices")),
  logs: () => unwrap<LogsResponse>(api.get<LogsResponse>("/logs")),

  set: (payload: { ssid: string; key: string }) =>
    unwrap<ActionResponse>(
      api.post<ActionResponse>("/hotspot/set", JSON.stringify(payload), {
        headers: { "Content-Type": "application/json" },
      }),
    ),
  start: () =>
    unwrap<ActionResponse>(api.post<ActionResponse>("/hotspot/start")),
  stop: () => unwrap<ActionResponse>(api.post<ActionResponse>("/hotspot/stop")),
  restart: () =>
    unwrap<ActionResponse>(api.post<ActionResponse>("/hotspot/restart")),
  fix: () => unwrap<ActionResponse>(api.post<ActionResponse>("/hotspot/fix")),
};
