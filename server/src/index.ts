import app from "./app";
import { elevate } from "./utils/elevate";
import { run } from "./utils/exec";
import { isAdmin } from "./utils/isAdmin";

const PORT = process.env.PORT || 4000;

if (!isAdmin()) {
  console.error("Not an Administrator. Elevating...");
  elevate()
  console.log("Elevated")
}
app.listen(PORT, () => {
  console.log(`Server running quietly on http://localhost:${PORT}`);
  run(`start http://localhost:${PORT}`);
});
