import app from "./app";
import { errorApp } from "./errorApp";
import { run } from "./utils/exec";
import { isAdmin } from "./utils/isAdmin";

export const PORT = process.env.PORT || 4000;

if (!isAdmin()) {
  errorApp.listen(PORT, () => {
    // 1. Force open the browser to show the error page
    run(`start http://localhost:${PORT}/admin-error.html`);
  });
} else {
  // Standard production operational startup
  app.listen(PORT, () => {
    console.log(`Server running quietly on http://localhost:${PORT}`);
    run(`start http://localhost:${PORT}`);
  });
}
