import { getConnectedDevices } from "@/services/devices.service";
import { hotspotService } from "@/services/hotspot.service";
import { log } from "@/utils/logger";
import { Router } from "express";

const hotspotRouter: Router = Router();

const actionResult = (success: boolean, message: string) => ({
  success,
  message,
});

const handleAction = async (
  res: any,
  action: () => Promise<{ stdout?: string; stderr?: string }>,
) => {
  try {
    const result = await action();
    const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
    if (!output) {
      return res.json(
        actionResult(true, "The hotspot request completed successfully."),
      );
    }
    return res.json(actionResult(true, output));
  } catch (error) {
    console.error("Hotspot action failed", error);
    return res.json(
      actionResult(false, "The hotspot request could not be completed."),
    );
  }
};

hotspotRouter.post("/set", async (req, res) => {
  try {
    const { ssid = "HNet", key = "disconnect" } = req.body as {
      ssid?: string;
      key?: string;
    };
    const normalizedSsid = `${ssid}`.trim();
    const normalizedKey = `${key}`.trim();
    const result = await hotspotService.set({
      ssid: normalizedSsid || "HNet",
      key: normalizedKey || "disconnect",
    });
    log("success", `Updated hotspot name to ${normalizedSsid || "HNet"}.`);
    return res.json(
      actionResult(
        true,
        result.stdout ? result.stdout.trim() : "Hotspot settings updated.",
      ),
    );
  } catch (error) {
    console.error("error in set", error);
    log("error", "Unable to update hotspot settings.");
    return res.json(actionResult(false, "Unable to update hotspot settings."));
  }
});

hotspotRouter.get("/start", async (_, res) => {
  const response = await handleAction(res, () => hotspotService.start());
  log("success", "Sharing started.");
  return response;
});
hotspotRouter.post("/start", async (_, res) => {
  const response = await handleAction(res, () => hotspotService.start());
  log("success", "Sharing started.");
  return response;
});

hotspotRouter.get("/stop", async (_, res) => {
  const response = await handleAction(res, () => hotspotService.stop());
  log("warning", "Sharing stopped.");
  return response;
});
hotspotRouter.post("/stop", async (_, res) => {
  const response = await handleAction(res, () => hotspotService.stop());
  log("warning", "Sharing stopped.");
  return response;
});

hotspotRouter.get("/status", async (_, res) => {
  const result = await hotspotService.status();
  res.json(result);
});

hotspotRouter.get("/devices", async (_, res) => {
  const devices = await getConnectedDevices();
  return res.json({ success: true, devices });
});

export default hotspotRouter;
