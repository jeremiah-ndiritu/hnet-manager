import app from "./app";
import { errorApp } from "./errorApp";
import { run } from "./utils/exec";
import { isAdmin } from "./utils/isAdmin";

export const PORT = process.env.PORT || 4000;

if (!isAdmin()) {
  const tempServer = errorApp.listen(PORT, () => {
    // 1. Force open the browser to show the error page
    run(`start http://localhost:${PORT}/admin-error`);

    // 2. Allow 2 seconds for the browser process to initialize, then close everything
    setTimeout(() => {
      tempServer.close(() => {
        process.exit(1);
      });
    }, 2000);
  });
} else {
  // Standard production operational startup
  app.listen(PORT, () => {
    console.log(`Server running quietly on http://localhost:${PORT}`);
    run(`start http://localhost:${PORT}`);
  });
}
