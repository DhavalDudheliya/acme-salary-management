"use client";

import { useAuth } from "@/lib/auth-context";
import { GlobalSearch } from "@/components/core/global-search";
import { HeaderNotificationsButton } from "./header-notifications-button";
import { HeaderSearchTrigger } from "./header-search-trigger";
import { HeaderUserMenu } from "./header-user-menu";
import { useSearchHotkey } from "./use-search-hotkey";
import { getUserDisplay } from "./user-display";

/**
 * AppHeader — Top bar for the authenticated app shell.
 */
export default function AppHeader() {
  const { user, logout } = useAuth();
  const { open: searchOpen, setOpen: setSearchOpen, isMac } = useSearchHotkey();
  const userDisplay = getUserDisplay(user);

  return (
    <>
      <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-background px-6">
        <HeaderSearchTrigger isMac={isMac} onOpen={() => setSearchOpen(true)} />

        <div className="flex items-center gap-2">
          <HeaderNotificationsButton />
          <HeaderUserMenu display={userDisplay} onLogout={logout} />
        </div>
      </header>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
