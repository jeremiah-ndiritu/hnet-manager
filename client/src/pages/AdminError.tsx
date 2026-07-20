export default function AdminError() {
  const handleExitClick = () => {
    // Closes the window tab since the backend server has already safely terminated
    window.close();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 selection:bg-primary selection:text-white">
      {/* Structural Card Layout Containers */}
      <div className="card w-full max-w-md p-6 text-center border-border bg-card shadow-lg md:p-8">
        {/* Warning Icon Decorative Visual Frame */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
          <svg
            xmlns="http://w3.org"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Message Headers */}
        <h1 className="text-xl font-bold tracking-tight text-text sm:text-2xl">
          Admin Privileges Required
        </h1>
        <p className="mt-3 text-sm text-text-muted leading-relaxed">
          HNetManager requires local machine elevation to programmatically
          interface with system wireless network adapters and execute host
          network commands.
        </p>

        {/* Instructive Walkthrough Block Layout */}
        <div className="my-6 rounded-lg bg-surface border border-border p-4 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            How to resolve:
          </h2>
          <ol className="mt-2 space-y-2.5 text-sm text-text">
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-border text-xs font-mono text-text-muted">
                1
              </span>
              <span>Close the dead application console window.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-border text-xs font-mono text-text-muted">
                2
              </span>
              <span>
                Right-click the executable file{" "}
                <code className="font-mono text-xs bg-bg px-1 py-0.5 rounded border border-border text-danger">
                  HNetManager.exe
                </code>
                .
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-mono text-primary font-bold">
                3
              </span>
              <span className="font-medium">
                Select{" "}
                <strong className="text-primary font-semibold">
                  Run as administrator
                </strong>
                .
              </span>
            </li>
          </ol>
        </div>

        {/* Operational Dismiss Button */}
        <button
          onClick={handleExitClick}
          className="btn-secondary w-full justify-center rounded-lg py-2.5 shadow-xs font-medium cursor-pointer"
        >
          Dismiss & Close Page
        </button>
      </div>

      {/* Background Micro Branding Disclaimer */}
      <span className="mt-4 text-xs font-mono text-text-muted/60 tracking-tight">
        Process Exited (Code 1) · HNet Security Subsystem
      </span>
    </div>
  );
}
