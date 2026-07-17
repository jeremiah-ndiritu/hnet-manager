import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import TanStack Query core providers
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import TanStack Query Devtools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Devtools will only open on click and attach to the bottom right */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  </React.StrictMode>,
);
