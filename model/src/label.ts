import type { BlockData } from "./types";

/** Subtitle shown when the user has not set a custom block label. */
export function defaultSubtitle(data: Pick<BlockData, "abundanceRef" | "subtitleLabel">): string {
  if (data.abundanceRef === undefined) return "Select Abundance and Metrics";
  return data.subtitleLabel ?? "";
}
