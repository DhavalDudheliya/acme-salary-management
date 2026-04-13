"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  emailService,
  type EmailConnectionStatus,
} from "@/lib/services/email.service";

import { EmailSettingsHeader } from "@/components/settings/email/email-settings-header";
import { HowItWorksCard } from "@/components/settings/email/how-it-works-card";
import { EmailConnectionsList } from "@/components/settings/email/email-connections-list";

export function EmailSettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<EmailConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await emailService.getStatus();
      setStatus(data);
    } catch {
      toast.error("Failed to load email connection status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Show toast based on OAuth callback query params
  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");

    if (connected === "gmail") {
      toast.success("Gmail account connected successfully!", {
        description: "Incoming emails will now create support tickets.",
      });
      router.replace("/settings/email");
    } else if (connected === "outlook") {
      toast.success("Outlook account connected successfully!", {
        description: "Incoming emails will now create support tickets.",
      });
      router.replace("/settings/email");
    } else if (error) {
      const message = error.includes("gmail")
        ? "Failed to connect Gmail account"
        : "Failed to connect Outlook account";
      toast.error(message, {
        description: "Please try again. Check the console for details.",
      });
      router.replace("/settings/email");
    }
  }, [searchParams, router]);

  return (
    <div className="flex-1 space-y-6 p-8 max-w-5xl mx-auto">
      <EmailSettingsHeader onRefresh={fetchStatus} loading={loading} />
      <HowItWorksCard />
      <EmailConnectionsList
        status={status}
        loading={loading}
        onStatusChange={fetchStatus}
      />
    </div>
  );
}
