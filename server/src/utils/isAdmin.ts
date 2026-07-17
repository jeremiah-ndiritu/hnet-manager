import { execSync } from "child_process";

export function isAdmin() {
  try {
    const result = execSync(
      `powershell -Command "([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)"`,
      { encoding: "utf8" },
    );

    return result.trim().toLowerCase() === "true";
  } catch {
    return false;
  }
}
