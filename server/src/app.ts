import express, { type Express } from "express";
import cors from "cors";
import path from "path";

import wifiRouter from "./routes/wifi.routes";
import hotspotRouter from "./routes/hotspot.routes";
import logRouter from "./routes/logs.routes";

const app: Express = express();

// 1. DETERMINE PACKAGED STATE & LOCATE THE FRONTEND DIST DIRECTORY
export const isPackaged = (process as any)?.pkg ? true : false;

export const BACKEND_DIR = isPackaged
  ? path.dirname(process.execPath)
  : __dirname;

// Fix: Steps out of 'server/bundled' inside the executable layout
const frontendPath = path.join(__dirname, "client/dist");


// 2. MIDDLEWARES & STATIC ASSET ENGINE
app.use(cors());
app.use(express.json());

// Serve your compiled static React assets
app.use(express.static(frontendPath));

// 3. MOUNT CORE API ROUTES
app.use("/wifi", wifiRouter);
app.use("/hotspot", hotspotRouter);
app.use("/logs", logRouter);

// 4. FALLBACK CLIENT ROUTING CATCH-ALL
// Ensures single-page app refreshes and routing variables load cleanly
app.get("{/*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
