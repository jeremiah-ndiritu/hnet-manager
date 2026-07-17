import { Router } from "express";
const wifiRouter: Router = Router();

wifiRouter.get("/status", (req, res) => {
  res.json({ status: "active" });
});

export default wifiRouter;
