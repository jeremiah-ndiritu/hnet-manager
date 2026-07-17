import { useQuery } from "@tanstack/react-query";
import { wifiApi } from "../api/wifi";

export function useStatus() {
  return useQuery({
    queryKey: ["status"],
    queryFn: wifiApi.status,
    refetchInterval: 5000,
  });
}
