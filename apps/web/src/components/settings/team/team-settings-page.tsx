"use client";

import { useEffect, useState, useCallback } from "react";
import {
  invitationService,
  type Invitation,
} from "@/lib/services/invitation.service";
import { toast } from "sonner";

import { TeamSettingsHeader } from "@/components/settings/team/team-settings-header";
import { PendingInvitationsCard } from "@/components/settings/team/pending-invitations-card";

export function TeamSettingsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await invitationService.getPendingInvitations();
      setInvitations(data);
    } catch (error) {
      toast.error("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleRevoke = async (id: string) => {
    try {
      await invitationService.revokeInvitation(id);
      toast.success("Invitation revoked");
      fetchInvitations();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to revoke invitation");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 max-w-5xl mx-auto">
      <TeamSettingsHeader onInviteSuccess={fetchInvitations} />
      <PendingInvitationsCard
        invitations={invitations}
        loading={loading}
        onRevoke={handleRevoke}
      />
    </div>
  );
}
