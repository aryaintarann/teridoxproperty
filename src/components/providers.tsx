"use client";

import { useEffect, useState } from "react";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <TooltipProvider>
      {children}
      {mounted && <GooeyToaster position="bottom-right" theme="light" />}
    </TooltipProvider>
  );
}
