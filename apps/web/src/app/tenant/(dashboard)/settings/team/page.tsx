"use client";

import { useEffect, useState, useCallback } from "react";
import { InviteAgentDialog } from "@/components/team/invite-agent-dialog";
import {
  invitationService,
  type Invitation,
} from "@/lib/services/invitation.service";
import { formatDistanceToNow } from "date-fns";
import { Mail, Users, Trash2 } from "lucide-react";
import { Button } from "@supporthub/ui/components/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@supporthub/ui/components/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@supporthub/ui/components/card";

export default function TeamSettingsPage() {
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
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-3xl flex items-center gap-2 font-bold tracking-tight">
            <Users className="h-8 w-8 text-primary" />
            Team Settings
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage your incoming agents and sent invitations.
          </p>
        </div>
        <div>
          <InviteAgentDialog onInviteSuccess={fetchInvitations} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>
            Agents who haven't accepted their invite yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8 text-muted-foreground">
              Loading...
            </div>
          ) : invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No pending invitations</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                You haven't sent any invitations yet, or all your invited agents
                have joined.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Pending
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(inv.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(inv.expiresAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(inv.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
