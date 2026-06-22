import type { GraphMakerState } from "@milaboratories/graph-maker";
import type { PlDataTableStateV2, PlRef } from "@platforma-sdk/model";

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

export type MetricUI = Metric & {
  id: string;
  isExpanded?: boolean;
};

/**
 * Unified V3 data — the UI's persisted state. `metrics` is the editable list
 * (with per-row `id`/`isExpanded`); the args lambda projects it to `Metric[]`.
 * The block labels and table/graph view state are display-only.
 */
export type BlockData = {
  abundanceRef?: PlRef;
  metrics: MetricUI[];
  defaultBlockLabel: string;
  customBlockLabel: string;
  tableState: PlDataTableStateV2;
  graphState: GraphMakerState;
};

/**
 * Workflow-facing args, projected from `data`. Block labels and view state are
 * not projected — only the input ref and the stripped metric list reach the
 * workflow. `abundanceRef` is required: the args lambda throws when absent.
 */
export type BlockArgs = {
  abundanceRef: PlRef;
  metrics: Metric[];
};

/** Legacy V1 on-disk shapes, consumed once by `.upgradeLegacy`. */
export type LegacyBlockArgs = {
  defaultBlockLabel: string;
  customBlockLabel: string;
  abundanceRef?: PlRef;
  metrics: Metric[];
};
export type LegacyUiState = {
  metrics: MetricUI[];
  tableState: PlDataTableStateV2;
  graphState: GraphMakerState;
};
