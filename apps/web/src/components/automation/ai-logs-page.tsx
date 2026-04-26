"use client";

import React, { useState } from "react";
import { AILogItem } from "./ai-log-item";
import { AILogsHeader } from "./ai-logs-header";
import { AILogsEmpty } from "./ai-logs-empty";
import { AILogsPagination } from "./ai-logs-pagination";
import { useAILogs } from "@/hooks/use-automation";

export function AILogsPage() {
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading } = useAILogs({ page, limit });

  const logs = data?.logs || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <AILogsHeader />

      {/* Logs table */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">
          Loading decisions...
        </div>
      ) : logs.length === 0 ? (
        <AILogsEmpty />
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <AILogItem key={log.id} log={log} />
          ))}
        </div>
      )}

      <AILogsPagination
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
