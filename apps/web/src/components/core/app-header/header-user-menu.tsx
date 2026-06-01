"use client";

import { LogOut, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@supporthub/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@supporthub/ui/components/dropdown-menu";
import type { UserDisplay } from "./user-display";

interface HeaderUserMenuProps {
  display: UserDisplay;
  onLogout: () => void;
}

export function HeaderUserMenu({ display, onLogout }: HeaderUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted focus:outline-none">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-tight text-foreground">
            {display.fullName}
          </p>
          <p className="text-xs capitalize text-muted-foreground">
            {display.roleLabel}
          </p>
        </div>
        <Avatar>
          {display.avatarUrl && (
            <AvatarImage src={display.avatarUrl} alt={display.fullName} />
          )}
          <AvatarFallback>{display.initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{display.fullName}</span>
              <span className="text-xs text-muted-foreground">
                {display.email}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
