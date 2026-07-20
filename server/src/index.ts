import { run } from "./utils/exec";
import { isAdmin } from "./utils/isAdmin";
import express from "express";
import path from "path";

const PORT = process.env.PORT || 4000;

// Track the packaged relative folder asset pathway
const frontendPath = path.join(__dirname, "client/dist");

if (!isAdmin()) {
  console.log(
    "❌ Unauthorized: Missing privileges. Booting lightweight error framework...",
  );

  // CRITICAL FIX: Initialize a completely isolated Express instance.
  // This ensures your standard 'app.ts' fallback/static engine never runs!
  const errorApp = express();

  // 1. Explicitly serve ONLY the dedicated raw HTML file at the root route
  errorApp.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "dist", "admin-error.html"));
  });

  // 2. Handle favicon/asset background requests cleanly to prevent 404s
  errorApp.use(express.static(frontendPath));

  // 3. Start the standalone server instance
  const errorServer = errorApp.listen(PORT, () => {
    // Fire open the browser to the root server domain
    run(`start http://localhost:${PORT}`);

    // Hold open the process for 2 seconds to allow the browser to safely pull the document stream, then terminate
    setTimeout(() => {
      errorServer.close(() => {
        process.exit(1);
      });
    }, 2000);
  });
} else {
  // CRITICAL FIX: Only load and execute your master app engine when authorization passes.
  // This delays the 'import' block completely until you are confirmed Admin!
  const app = require("./app").default;

  app.listen(PORT, () => {
    console.log(`Server running quietly on http://localhost:${PORT}`);
    run(`start http://localhost:${PORT}`);
  });
}
