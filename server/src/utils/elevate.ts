import { spawn } from "child_process";

export function elevate() {
  spawn(
    "powershell",
    [
      "-Command",
      `Start-Process node -ArgumentList 'start' -Verb RunAs`,
    ],
    {
      detached: true,
      stdio: "ignore",
    },
  ).unref();
  
}
