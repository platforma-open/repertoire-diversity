import type { GraphMakerState } from "@milaboratories/graph-maker";
import { kind } from "@platforma-open/milaboratories.repertoire-diversity-2.kind";
import { createPlDataTableStateV2, DataModelBuilder } from "@platforma-sdk/model";
import type { MetricUI } from "@platforma-open/milaboratories.repertoire-diversity-2.kind";
import type { BlockData, BlockDataV1, LegacyBlockArgs, LegacyUiState } from "./types";

const defaultGraphState = (): GraphMakerState => ({
  title: "Sequence Diversity",
  template: "bar",
  currentTab: null,
});

const defaultMetrics = (): MetricUI[] => [
  {
    id: "observed",
    type: "observed",
    downsampling: { type: "hypergeometric", valueChooser: "auto" },
    isExpanded: false,
  },
  {
    id: "shannonWiener",
    type: "shannonWiener",
    downsampling: { type: "hypergeometric", valueChooser: "auto" },
    isExpanded: false,
  },
  {
    id: "chao1",
    type: "chao1",
    downsampling: { type: "hypergeometric", valueChooser: "auto" },
    isExpanded: false,
  },
  {
    id: "gini",
    type: "gini",
    downsampling: { type: "hypergeometric", valueChooser: "auto" },
    isExpanded: false,
  },
  {
    id: "d50",
    type: "d50",
    downsampling: { type: "hypergeometric", valueChooser: "auto" },
    isExpanded: false,
  },
];

export const blockDataModel = new DataModelBuilder({ kind })
  .from<BlockDataV1>("v1")
  // V1 split refData + metrics + block labels across `args`, with the editable
  // MetricUI[] and view state under `uiState`. Fold both into unified `data`.
  .upgradeLegacy<LegacyBlockArgs, LegacyUiState>(({ args, uiState }) => ({
    abundanceRef: args?.abundanceRef,
    // uiState.metrics (MetricUI[]) is V1's source of truth. If it is somehow
    // absent, recover the user's set from the projected args.metrics rather
    // than silently dropping to defaults; only seed defaults when neither exists.
    metrics:
      uiState?.metrics ??
      (args?.metrics?.length
        ? args.metrics.map((metric, i) => ({ ...metric, id: `metric-${i}`, isExpanded: false }))
        : defaultMetrics()),
    defaultBlockLabel: args?.defaultBlockLabel ?? "",
    customBlockLabel: args?.customBlockLabel ?? "",
    tableState: uiState?.tableState ?? createPlDataTableStateV2(),
    graphState: uiState?.graphState ?? defaultGraphState(),
  }))
  // The old label was the abundance's (or subset's) result-pool label alone, or a fixed hint
  // when none was resolved; the label carries over, the hint is recomputed from data.
  .migrate<BlockData>("v2", ({ defaultBlockLabel, ...rest }) => ({
    ...rest,
    subtitleLabel: defaultBlockLabel === "Select Abundance and Metrics" ? "" : defaultBlockLabel,
  }))
  .init(({ params }) => ({
    abundanceRef: params?.abundanceRef,
    filterRef: params?.filterRef,
    // A template may seed the metric rows; otherwise the block starts on the
    // default set rather than an empty editor.
    metrics: params?.metrics ?? defaultMetrics(),
    customBlockLabel: params?.customBlockLabel ?? "",
    // The abundance's label comes from the result pool, which `init` cannot reach; the UI
    // keeps it in sync.
    subtitleLabel: "",
    tableState: createPlDataTableStateV2(),
    graphState: defaultGraphState(),
  }));
