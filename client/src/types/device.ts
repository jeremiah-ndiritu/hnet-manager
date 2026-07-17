export interface Device {
  ip: string;
  mac: string;
  hostname?: string | null;
  displayName?: string | null;
  manufacturer?: string | null;
  deviceType?: string | null;
  ipAddress?: string;
  macAddress?: string;
}
