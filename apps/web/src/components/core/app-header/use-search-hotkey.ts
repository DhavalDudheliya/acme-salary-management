"use client";

import { useEffect, useState } from "react";

function getIsMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
}

export function useSearchHotkey() {
  const [open, setOpen] = useState(false);
  const [isMac] = useState(getIsMac);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen, isMac };
}
