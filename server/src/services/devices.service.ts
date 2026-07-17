import { run } from "@/utils/exec";

interface Device {
  ip: string;
  mac: string;
  hostname?: string;
}

export const getConnectedDevices = async (): Promise<Device[]> => {
  try {
    const result = await run("arp -a");
    const lines = (result.stdout || "").split(/\r?\n/).slice(3);
    const devices: Device[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const parts = line.split(/\s+/).filter(Boolean);
      const ip = parts[0];
      const mac = parts[1];
      const hostname =
        parts[2] && parts[2] !== "dynamic" ? parts[2] : undefined;

      if (ip && mac) {
        devices.push({ ip, mac, ...(hostname ? { hostname } : {}) });
      }
    }

    return devices;
  } catch {
    return [];
  }
};
