"use client";

import { Bell } from "lucide-react";
import { Button } from "@supporthub/ui/components/button";

export function HeaderNotificationsButton() {
  return (
    <Button variant="ghost" size="icon" className="relative h-9 w-9">
      <Bell className="h-4 w-4 text-muted-foreground" />
      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
      <span className="sr-only">Notifications</span>
    </Button>
  );
}
