import path from "path";
import express, { type Express } from "express";

// Create a minimal fallback server just to show the error page
export const errorApp: Express = express();

// Reuse your existing packaged client dist path mapping
const frontendPath = path.join(__dirname, "client/dist");
errorApp.use(express.static(frontendPath));

// Catch-all route to serve the index.html (which contains your error router/page)
errorApp.get("{/*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
