import { run } from "../utils/exec";

interface HotspotStatus {
  started: boolean;
  ssid: string;
  maxClients: number;
  clients: number;
  channel: number | null;
  radioType: string | null;
  band: string | null;
  bssid: string | null;
}

function parseStatus(output: string): HotspotStatus {
  const normalized = output.replace(/\r/g, "");
  const lineMap = Object.fromEntries(
    normalized
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(":");
        const key = parts[0]?.trim().toLowerCase() ?? "";
        if (!key || parts.length < 2) return [line, ""];
        return [key, parts.slice(1).join(":").trim()];
      }),
  );

  const started = /started/i.test(normalized);
  const ssid = lineMap["ssid name"] || lineMap["ssid"] || "HNet";
  const maxClients = Number.parseInt(
    lineMap["max number of clients"] || "0",
    10,
  );
  const clients = Number.parseInt(lineMap["number of clients"] || "0", 10);
  const channel = Number.parseInt(lineMap["channel"] || "", 10) || null;
  const radioType = lineMap["radio type"] || null;
  const band = lineMap["band"] || null;
  const bssid = lineMap["bssid"] || null;

  return {
    started,
    ssid: ssid || "HNet",
    maxClients: Number.isFinite(maxClients) ? maxClients : 0,
    clients: Number.isFinite(clients) ? clients : 0,
    channel,
    radioType,
    band,
    bssid,
  };
}

export const hotspotService = {
  set: ({ ssid, key }: { ssid: string; key: string }) =>
    run(`netsh wlan set hostednetwork mode=allow ssid=${ssid} key=${key}`),
  start: () => run("netsh wlan start hostednetwork"),
  stop: () => run("netsh wlan stop hostednetwork"),
  status: async () => {
    const result = await run("netsh wlan show hostednetwork");
    return {
      success: true,
      data: parseStatus(result.stdout || result.stderr || ""),
    };
  },
};
