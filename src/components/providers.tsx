"use client";

import { useEffect, useState } from "react";
import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Import phantom-ui dynamically to ensure it only runs on the client
    import("@aejkatappaja/phantom-ui").then(() => {
      setMounted(true);
    });
  }, []);

  return (
    <TooltipProvider>
      {children}
      {mounted && <GooeyToaster position="bottom-right" theme="light" />}
    </TooltipProvider>
  );
}
