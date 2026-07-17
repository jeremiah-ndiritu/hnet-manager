import { useQuery } from "@tanstack/react-query";
import { wifiApi } from "../api/wifi";

export function useDevices() {
  return useQuery({
    queryKey: ["status"],
    queryFn: wifiApi.devices,
    refetchInterval: 5000,
  });
}
