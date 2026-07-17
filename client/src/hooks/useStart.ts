import { useQuery } from "@tanstack/react-query";
import { wifiApi } from "../api/wifi";

export function useStart() {
  return useQuery({
    queryKey: ["status"],
    queryFn: wifiApi.start,
    refetchInterval: 5000,
  });
}
