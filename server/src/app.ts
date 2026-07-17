import express, { type Express } from "express";
import cors from "cors";

import wifiRouter from "./routes/wifi.routes";
import hotspotRouter from "./routes/hotspot.routes";
import logRouter from "./routes/logs.routes";

const app: Express = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/wifi", wifiRouter);
app.use("/hotspot", hotspotRouter);
app.use("/logs", logRouter);

export default app;
