import { api } from "./client";

export const wifiApi = {
  status: () => api.get("/hotspot/status"),
  devices: () => api.get("/hotspot/devices"),

  start: () => api.post("/hotspot/start"),
  stop: () => api.post("/hotspot/stop"),
  restart: () => api.post("/hotspot/restart"),
  fix: () => api.post("/hotspot/fix"),
};
