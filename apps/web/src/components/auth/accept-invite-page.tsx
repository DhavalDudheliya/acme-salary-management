"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { invitationService } from "@/lib/services/invitation.service";
import { toast } from "sonner";
import { Inbox, Loader2, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";

import { Button } from "@supporthub/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@supporthub/ui/components/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@supporthub/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@supporthub/ui/components/input-group";
import { Input } from "@supporthub/ui/components/input";
import PasswordStrengthMeter from "./password-strength-meter";

const acceptSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AcceptFormValues = z.infer<typeof acceptSchema>;

export function AcceptInvitePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AcceptFormValues>({
    resolver: zodResolver(acceptSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
  });
  const currentPassword = watch("password", "");

  async function onSubmit(values: AcceptFormValues) {
    if (!token) {
      toast.error("Valid invitation token is required");
      return;
    }

    setLoading(true);
    try {
      await invitationService.acceptInvitation({
        token,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
      });

      setSuccess(true);
      toast.success("Account created successfully. You can now log in.");

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle>Invalid Link</CardTitle>
            <CardDescription>
              This invitation link is missing a required security token. Please
              check your email and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="w-full text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to the team!</CardTitle>
            <CardDescription className="text-base mt-2">
              Your account has been set up successfully. You'll be redirected to
              the login page momentarily.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
            <Inbox className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Accept Invitation</CardTitle>
          <CardDescription>
            Complete your profile to join your team's workspace on SupportHub.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <FieldContent>
                  <Input
                    id="firstName"
                    placeholder="Jane"
                    disabled={loading}
                    {...register("firstName")}
                  />
                </FieldContent>
                {errors.firstName && <FieldError errors={[errors.firstName]} />}
              </Field>

              <Field data-invalid={!!errors.lastName}>
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <FieldContent>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    disabled={loading}
                    {...register("lastName")}
                  />
                </FieldContent>
                {errors.lastName && <FieldError errors={[errors.lastName]} />}
              </Field>
            </div>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Create Password</FieldLabel>
              <FieldContent>
                <InputGroup className="h-10">
                  <InputGroupAddon>
                    <InputGroupText>
                      <Lock aria-hidden="true" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    disabled={loading}
                    placeholder="........"
                    {...register("password")}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </FieldContent>
              {errors.password && <FieldError errors={[errors.password]} />}
              <PasswordStrengthMeter password={currentPassword} />
            </Field>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
