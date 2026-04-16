import React from "react";

export function AILogsHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-foreground">AI Decision Log</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Audit trail of every AI classification decision. See what tags were
        applied, which rules fired, and how long the AI took.
      </p>
    </div>
  );
}
