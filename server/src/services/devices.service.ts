import { run } from "@/utils/exec";

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

const VENDOR_LOOKUP: Record<string, string> = {
  EA4349: "Samsung",
  E84349: "Samsung",
  A4DDAA: "Apple",
  A4D18B: "Apple",
  000000: "Unknown",
  001122: "Cisco",
  000E0C: "Cisco",
  001E2A: "Dell",
  00E04C: "Intel",
  00A0C9: "Hewlett Packard",
  001E67: "Hewlett Packard",
  001C0F: "Huawei",
  0025B3: "Huawei",
  0018F3: "Lenovo",
  0004EA: "Xiaomi",
  0016F6: "Xiaomi",
  001A11: "Google",
  00157D: "Microsoft",
};

function normalizeIp(value: string): string {
  return value.trim();
}

function normalizeMac(value: string): string {
  const cleaned = value.trim().toLowerCase().replace(/[^0-9a-f]/g, "");
  if (cleaned.length !== 12) return "";
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10, 12)}`;
}

function isFilteredOut(line: string): boolean {
  const normalized = line.trim();
  if (!normalized) return true;
  const lowered = normalized.toLowerCase();
  if (lowered === "---") return true;
  if (lowered.startsWith("interface:")) return true;
  if (lowered.startsWith("internet address")) return true;
  if (lowered.startsWith("physical address")) return true;
  if (lowered === "type") return true;
  if (lowered.startsWith("warning:")) return true;
  return false;
}

function isLikelyRealDevice(ip: string, mac: string): boolean {
  const normalizedIp = normalizeIp(ip);
  const normalizedMac = normalizeMac(mac);

  if (!normalizedIp || !normalizedMac) return false;
  if (normalizedIp === "255.255.255.255") return false;
  if (normalizedIp.endsWith(".255")) return false;
  if (normalizedIp.startsWith("224.") || normalizedIp.startsWith("239.")) return false;
  if (normalizedIp === "0.0.0.0" || normalizedIp === "127.0.0.1") return false;
  if (normalizedMac === "ff-ff-ff-ff-ff-ff" || normalizedMac === "00-00-00-00-00-00") return false;

  return true;
}

function sanitizeHostname(value: string | undefined): string | null {
  if (!value) return null;
  const cleaned = value.trim().replace(/\.$/, "");
  const placeholderValues = ["unknown", "physical", "static", "--", "-", "none", "na"];
  if (!cleaned || placeholderValues.includes(cleaned.toLowerCase())) return null;
  return cleaned;
}

function inferManufacturer(mac: string): string | null {
  const normalizedMac = normalizeMac(mac);
  if (!normalizedMac) return null;
  const oui = normalizedMac.replace(/-/g, "").slice(0, 6).toUpperCase();
  return VENDOR_LOOKUP[oui] || null;
}

function inferDeviceType(hostname: string | null, manufacturer: string | null): string | null {
  const source = `${hostname || ""} ${manufacturer || ""}`.toLowerCase();
  if (!source) return null;
  if (/iphone|ipad|ipod|macbook|imac/i.test(source)) return "Phone";
  if (/android|galaxy|samsung|pixel|xiaomi|redmi|oneplus|oppo|vivo|motorola|nokia/i.test(source)) return "Phone";
  if (/laptop|notebook|surface|thinkpad|xps|latitude|elitebook|spectre|ultrabook/i.test(source)) return "Laptop";
  if (/desktop|workstation|pc|win/i.test(source)) return "Desktop";
  if (/router|switch|hub|nas|printer|access point|network/i.test(source)) return "Network Device";
  if (manufacturer) return "Device";
  return null;
}

function buildDisplayName(hostname: string | null, manufacturer: string | null, deviceType: string | null): string {
  if (hostname) return hostname;
  if (manufacturer) {
    const normalizedManufacturer = manufacturer.replace(/\s+Device$/i, "");
    if (deviceType && deviceType !== "Device") {
      return `${normalizedManufacturer} ${deviceType}`;
    }
    return `${normalizedManufacturer} Device`;
  }
  return "Unknown Device";
}

async function resolveHostname(ip: string): Promise<string | null> {
  try {
    const pingOutput = await run(`ping -a -n 1 -w 300 ${ip}`);
    const text = `${pingOutput.stdout || ""}${pingOutput.stderr || ""}`;
    const match = text.match(/Pinging\s+([^\s\[]+)/i);
    if (match?.[1]) return sanitizeHostname(match[1]);
  } catch {
    // Ignore and fall back to NetBIOS lookup.
  }

  try {
    const nbtOutput = await run(`nbtstat -A ${ip}`);
    const text = `${nbtOutput.stdout || ""}${nbtOutput.stderr || ""}`;
    const match = text.match(/\b([A-Za-z0-9-]+)\s*<00>/i);
    if (match?.[1]) return sanitizeHostname(match[1]);
  } catch {
    // Ignore and return null.
  }

  return null;
}

export const getConnectedDevices = async (): Promise<Device[]> => {
  try {
    const result = await run("arp -a");
    const rawLines = (result.stdout || "").split(/\r?\n/);
    const devices: Device[] = [];

    for (const rawLine of rawLines) {
      const line = rawLine.trim();
      if (!line || isFilteredOut(line)) continue;

      const parts = line.split(/\s+/).filter(Boolean);
      if (parts.length < 2) continue;

      const [ip, mac] = parts;
      if (!isLikelyRealDevice(ip, mac)) continue;

      const normalizedMac = normalizeMac(mac);
      const hostname = sanitizeHostname(parts[2] && parts[2] !== "dynamic" ? parts[2] : undefined);
      const resolvedHostname = hostname || (await resolveHostname(ip));
      const manufacturer = inferManufacturer(normalizedMac || mac);
      const deviceType = inferDeviceType(resolvedHostname || hostname, manufacturer);
      const displayName = buildDisplayName(resolvedHostname || hostname, manufacturer, deviceType);

      devices.push({
        ip: normalizeIp(ip),
        mac: normalizedMac || mac,
        hostname: resolvedHostname || hostname || null,
        displayName,
        manufacturer,
        deviceType,
        ipAddress: normalizeIp(ip),
        macAddress: normalizedMac || mac,
      });
    }

    return devices;
  } catch {
    return [];
  }
};
