import { run } from "@/utils/exec";

export const hotspotService = {
  set: ({ssid, key}:{ssid:string, key: string})=> run(`netsh wlan set hostednetwork mode=allow ssid=${ssid} key=${key}`),
  start: () => run("netsh wlan start hostednetwork"),

  stop: () => run("netsh wlan stop hostednetwork"),

  status: () => run("netsh wlan show hostednetwork"),
};
