import { useQuery } from "@tanstack/react-query";
import { wifiApi } from "../api/wifi";

export function useStop() {
  return useQuery({
    queryKey: ["status"],
    queryFn: wifiApi.stop,
    refetchInterval: 5000,
  });
}
