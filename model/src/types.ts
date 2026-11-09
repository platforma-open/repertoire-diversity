import type { GraphMakerState } from "@milaboratories/graph-maker";
import type { PlDataTableStateV2, PlRef } from "@platforma-sdk/model";
// The metric vocabulary lives in the kind: its init-params contract names these
// types and a kind cannot import from the model. Imported here for the shapes
// below that are built from them.
import type { Metric, MetricUI } from "@platforma-open/milaboratories.repertoire-diversity-2.kind";

/**
 * Unified V3 data — the UI's persisted state. `metrics` is the editable list
 * (with per-row `id`/`isExpanded`); the args lambda projects it to `Metric[]`.
 * The block labels and table/graph view state are display-only.
 */
export type BlockData = {
  abundanceRef?: PlRef;
  /** Subset column picked with the abundance in PlDatasetSelector (e.g. a Repertoire Labeling label). */
  filterRef?: PlRef;
  metrics: MetricUI[];
  customBlockLabel: string;
  /**
   * The abundance's (or subset's) label as the result pool shows it. Written by the abundance
   * picker on a user pick; feeds the subtitle only, never the workflow.
   */
  subtitleLabel?: string;
  tableState: PlDataTableStateV2;
  graphState: GraphMakerState;
};

/** Data as stored before `subtitleLabel` replaced the UI-computed `defaultBlockLabel`. */
export type BlockDataV1 = Omit<BlockData, "subtitleLabel"> & {
  defaultBlockLabel: string;
};

/**
 * Workflow-facing args, projected from `data`. Block labels and view state are
 * not projected — only the input ref and the stripped metric list reach the
 * workflow. `abundanceRef` is required: the args lambda throws when absent.
 */
export type BlockArgs = {
  abundanceRef: PlRef;
  /** Canonical id of the subset column; set only when a filter is picked. */
  inputFilter?: string;
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
