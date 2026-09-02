/**
 * The diversity-metric vocabulary. It lives in the kind because the kind's
 * init-params contract names these types, and a kind cannot import from the
 * model (the model depends on the kind, not the other way round).
 */

export type DiversityType =
  | "chao1"
  | "d50"
  | "efronThisted"
  | "observed"
  | "shannonWienerIndex"
  | "shannonWiener"
  | "normalizedShannonWiener"
  | "inverseSimpson"
  | "gini";

export type Metric = {
  type: DiversityType | undefined;
  downsampling: {
    type?: "none" | "top" | "cumtop" | "hypergeometric";
    valueChooser?: "min" | "fixed" | "max" | "auto";
    n?: number;
  };
};

/** One editable row: a metric plus the per-row identity/disclosure the editor keeps. */
export type MetricUI = Metric & {
  id: string;
  isExpanded?: boolean;
};

export const DIVERSITY_TYPES: readonly DiversityType[] = [
  "chao1",
  "d50",
  "efronThisted",
  "observed",
  "shannonWienerIndex",
  "shannonWiener",
  "normalizedShannonWiener",
  "inverseSimpson",
  "gini",
];

export const DOWNSAMPLING_TYPES: readonly string[] = ["none", "top", "cumtop", "hypergeometric"];
export const VALUE_CHOOSERS: readonly string[] = ["min", "fixed", "max", "auto"];
