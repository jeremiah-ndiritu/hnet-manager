import { logService } from "@/services/logs.service";
import { Router } from "express";

const logRouter: Router = Router();

logRouter.get("/", (_, res) => {
  return res.json({
    success: true,
    logs: logService.getAll(),
    message: "Logs fetched successfully.",
  });
});

export default logRouter;
