import path from "path";
import app, { frontendPath } from "./app";
import { run } from "./utils/exec";
import { isAdmin } from "./utils/isAdmin";

export const PORT = process.env.PORT || 4000;

if (!isAdmin()) {
  app.listen(PORT, () => {
     console.log(
       "Not an Administrator. Serving static error and shutting down...",
     );

     // 1. Intercept requests to /admin-error.html BEFORE any React fallbacks can execute
     app.get("/admin-error.html", (req, res) => {
       res.sendFile(path.join(frontendPath, "admin-error.html"));
     });

     // 2. Intercept root requests and route variables to point explicitly to the error asset
     app.get("/", (req, res) => {
       res.redirect("/admin-error.html");
     });
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
