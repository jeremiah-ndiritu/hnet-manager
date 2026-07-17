import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import LogsPage from "./pages/LogsPage";

export default function App() {
  return (
    <div className="app-container">
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "rounded-lg border border-border bg-surface text-text shadow-md",
          duration: 3200,
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
