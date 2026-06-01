import type { UserProfileProfile } from "@/lib/services/auth.service";

export interface UserDisplay {
  initials: string;
  fullName: string;
  roleLabel: string;
  email: string;
  avatarUrl?: string;
}

export function getUserDisplay(user: UserProfileProfile | null): UserDisplay {
  if (!user) {
    return {
      initials: "??",
      fullName: "Loading...",
      roleLabel: "Agent",
      email: "",
    };
  }

  return {
    initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
    fullName: `${user.firstName} ${user.lastName}`,
    roleLabel: user.role?.toLowerCase() ?? "agent",
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
}
