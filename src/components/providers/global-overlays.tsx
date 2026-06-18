"use client";

import { ToastContainer } from "@/components/ui/toast";
import { ActionCompletion } from "@/components/actions/action-completion";

/**
 * Global overlays rendered at the root layout level.
 * Includes toast notifications and action celebration animations.
 */
export function GlobalOverlays() {
  return (
    <>
      <ToastContainer />
      <ActionCompletion />
    </>
  );
}
