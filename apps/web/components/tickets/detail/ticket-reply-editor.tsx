"use client";

import { useState } from "react";
import { MessageSquare, Lock, Send } from "lucide-react";
import { Button } from "@supporthub/ui/components/button";
import { Textarea } from "@supporthub/ui/components/textarea";
import { cn } from "@supporthub/ui/lib/utils";

interface TicketReplyEditorProps {
  onAddComment: (body: string, isInternal: boolean) => Promise<void>;
  submitting: boolean;
}

export function TicketReplyEditor({
  onAddComment,
  submitting,
}: TicketReplyEditorProps) {
  const [replyBody, setReplyBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const handleSubmit = async () => {
    if (!replyBody.trim()) return;
    await onAddComment(replyBody, isInternal);
    setReplyBody("");
  };

  return (
    <div className="border-t border-border p-4">
      <div className="flex gap-2 mb-3">
        <Button
          type="button"
          size="sm"
          variant={!isInternal ? "default" : "ghost"}
          onClick={() => setIsInternal(false)}
          className={cn(
            "font-medium",
            !isInternal && "bg-primary text-primary-foreground",
          )}
        >
          <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
          Public Reply
        </Button>
        <Button
          type="button"
          size="sm"
          variant={isInternal ? "default" : "ghost"}
          onClick={() => setIsInternal(true)}
          className={cn(
            "font-medium",
            isInternal &&
              "bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500",
          )}
        >
          <Lock className="mr-1.5 h-3.5 w-3.5" />
          Internal Note
        </Button>
      </div>
      <Textarea
        placeholder="Type your message here..."
        value={replyBody}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setReplyBody(e.target.value)
        }
        rows={3}
        className={cn(
          isInternal &&
            "border-yellow-300 focus-visible:ring-yellow-500 dark:border-yellow-700",
        )}
      />
      <div className="flex justify-end mt-3">
        <Button
          onClick={handleSubmit}
          disabled={submitting || !replyBody.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          {isInternal ? "Add Note" : "Send Reply"}
        </Button>
      </div>
    </div>
  );
}
