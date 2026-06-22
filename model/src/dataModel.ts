import type { GraphMakerState } from "@milaboratories/graph-maker";
import { createPlDataTableStateV2, DataModelBuilder } from "@platforma-sdk/model";
import { getDefaultBlockLabel } from "./label";
import type { BlockData, LegacyBlockArgs, LegacyUiState, MetricUI } from "./types";

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

export const blockDataModel = new DataModelBuilder()
  .from<BlockData>("v1")
  // V1 split refData + metrics + block labels across `args`, with the editable
  // MetricUI[] and view state under `uiState`. Fold both into unified `data`.
  .upgradeLegacy<LegacyBlockArgs, LegacyUiState>(({ args, uiState }) => ({
    abundanceRef: args?.abundanceRef,
    metrics: uiState?.metrics ?? defaultMetrics(),
    defaultBlockLabel: args?.defaultBlockLabel ?? getDefaultBlockLabel({}),
    customBlockLabel: args?.customBlockLabel ?? "",
    tableState: uiState?.tableState ?? createPlDataTableStateV2(),
    graphState: uiState?.graphState ?? defaultGraphState(),
  }))
  .init(() => ({
    abundanceRef: undefined,
    metrics: defaultMetrics(),
    defaultBlockLabel: getDefaultBlockLabel({}),
    customBlockLabel: "",
    tableState: createPlDataTableStateV2(),
    graphState: defaultGraphState(),
  }));
