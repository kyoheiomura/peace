"use client";

import { Agentation } from "agentation";

/**
 * Visual feedback toolbar (development only).
 * Optional: run agentation-mcp and pass endpoint="http://localhost:4747" for Agent Sync.
 */
export function AgentationDev() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <Agentation />;
}
