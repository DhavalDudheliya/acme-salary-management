"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Check, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@supporthub/ui/components/button";

import { authService } from "@/lib/services/auth.service";

interface RegistrationSuccessProps {
  email: string | null;
  subdomain: string | null;
}

const COOLDOWN_SECONDS = 60;

/**
 * RegistrationSuccess - Step 3 of the registration flow.
 *
 * Displays after a successful registration with:
 * - The user's email (for verification prompt)
 * - The newly created workspace URL
 * - Actions to navigate to login or resend verification email
 */
export default function RegistrationSuccess({
  email,
  subdomain,
}: RegistrationSuccessProps) {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up the interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /** Start the cooldown countdown */
  const startCooldown = useCallback(() => {
    setCooldown(COOLDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  /** Call the API to resend the verification email */
  const handleResend = async () => {
    if (!email || isResending || cooldown > 0) return;

    setIsResending(true);
    try {
      await authService.resendVerification(email);
      toast.success("A new verification link has been sent to your email.");
      startCooldown();
    } catch (error: unknown) {
      const err = error as any;
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to resend verification email. Please try again later.";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  /** Redirect to the tenant login page — uses full redirect for cross-subdomain navigation */
  const goBackToLogin = () => {
    if (subdomain) {
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const rootDomain =
        process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3001";
      window.location.href = `${protocol}://${subdomain}.${rootDomain}/login`;
    } else {
      router.push("/login");
    }
  };

  const isResendDisabled = isResending || cooldown > 0 || !email;

  return (
    <div className="animate-in zoom-in-95 relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-lg duration-500">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-500/10 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative z-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 ring-4 ring-green-50 dark:bg-green-500/20 dark:ring-green-500/10">
          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          Check your email
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          We've sent a verification link to
          <br />
          <span className="font-semibold text-foreground">{email}</span>
        </p>

        <div className="mb-8 overflow-hidden rounded-xl border border-border bg-muted/30 p-4 text-left shadow-sm">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Workspace URL
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground shadow-sm">
            <span className="font-semibold text-primary">{subdomain}</span>
            <span className="text-muted-foreground">.supporthub.bond</span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <Button
            onClick={goBackToLogin}
            className="h-10 w-full text-base font-medium shadow-sm transition-all hover:-translate-y-0.5"
          >
            Go to Login
          </Button>
          <Button
            variant="ghost"
            disabled={isResendDisabled}
            onClick={handleResend}
            className="h-10 w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : cooldown > 0 ? (
              `Resend available in ${cooldown}s`
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
