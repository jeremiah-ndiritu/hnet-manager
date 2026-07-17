import type { Device } from "./device";

export interface HotspotStatus {
  started: boolean;

  ssid: string;

  maxClients: number;

  clients: number;

  channel: number | null;

  radioType: string | null;

  band: string | null;

  bssid: string | null;
}

export interface ActionResponse {
  success: boolean;

  message: string;
}

export interface DevicesResponse {
  success: boolean;

  devices: Device[];
}

export interface LogsResponse {
  success: boolean;

  logs: LogEntry[];
}

export interface LogEntry {
  id: string;

  timestamp: string;

  level: "info" | "success" | "warning" | "error";

  message: string;
}

export interface StatusResponse {
  success: boolean;

  data: HotspotStatus;
}
