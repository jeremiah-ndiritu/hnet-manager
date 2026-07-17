import { hotspotService } from "@/services/hotspot.service";
import { Router } from "express";

const hotspotRouter: Router = Router();

hotspotRouter.post("/set", async (req, res) => {
  try {
    const { ssid = "No internet, insecure", key = "disconnect" } = req.body;
    const result = await hotspotService.set({
      ssid: ssid.trim(),
      key: key.trim(),
    });
    return res.json(result)
  } catch (error) {
    console.log("error in set:>> ", error);
    return res.json({ message: "An error occured1", success: false });
  }
});

hotspotRouter.get("/start", async (_, res) => {
  const result = await hotspotService.start();

  res.json(result);
});
hotspotRouter.get("/stop", async (_, res) => {
  const result = await hotspotService.stop();

  res.json(result);
});
hotspotRouter.get("/status", async (_, res) => {
  const result = await hotspotService.status();

  res.json(result);
});
export default hotspotRouter;
