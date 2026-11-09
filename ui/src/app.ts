import { platforma } from "@platforma-open/milaboratories.repertoire-diversity-2.model";
import { plRefsEqual } from "@platforma-sdk/model";
import { defineAppV3 } from "@platforma-sdk/ui-vue";
import { computed, watch } from "vue";
import DiversityGraph from "./pages/DiversityGraph.vue";
import MainPage from "./pages/MainPage.vue";

export const sdkPlugin = defineAppV3(platforma, (app) => {
  app.model.data.customBlockLabel ??= "";

  syncSubtitleLabel(app.model);

  return {
    routes: {
      "/": () => MainPage,
      "/diversityGraph": () => DiversityGraph,
    },
  };
});

export const useApp = sdkPlugin.useApp;

type AppModel = ReturnType<typeof useApp>["model"];

function syncSubtitleLabel(model: AppModel) {
  // "" when no abundance is picked; undefined while the picked abundance or subset
  // is not among the options yet.
  const subtitleLabel = computed<string | undefined>(() => {
    // The subset's label already carries the abundance as a prefix.
    const { abundanceRef, filterRef } = model.data;
    if (!abundanceRef) return "";
    const option = model.outputs.abundanceOptions?.find((o) =>
      plRefsEqual(o.primary.ref, abundanceRef, true),
    );
    if (!option) return undefined;
    if (!filterRef) return option.primary.label;
    return option.filters?.find((f) => plRefsEqual(f.ref, filterRef, true))?.label;
  });

  watch(
    subtitleLabel,
    (label) => {
      if (label !== undefined && label !== model.data.subtitleLabel)
        model.data.subtitleLabel = label;
    },
    { immediate: true },
  );
}
