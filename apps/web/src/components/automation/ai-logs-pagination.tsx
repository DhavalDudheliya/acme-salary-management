import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@supporthub/ui/components/button";

export function AILogsPagination({
  total,
  page,
  totalPages,
  onPageChange,
}: {
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number | ((p: number) => number)) => void;
}) {
  if (totalPages <= 1) return null;

  const handlePrevPage = () => onPageChange((p) => Math.max(1, p - 1));
  const handleNextPage = () => onPageChange((p) => Math.min(totalPages, p + 1));

  return (
    <div className="flex items-center justify-between mt-6 px-1">
      <span className="text-xs text-muted-foreground">
        {total} total decisions
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevPage}
          disabled={page === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground px-2">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
