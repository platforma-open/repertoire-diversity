import {
  getDefaultBlockLabel,
  platforma,
} from "@platforma-open/milaboratories.repertoire-diversity-2.model";
import { plRefsEqual } from "@platforma-sdk/model";
import { defineAppV3 } from "@platforma-sdk/ui-vue";
import { watchEffect } from "vue";
import DiversityGraph from "./pages/DiversityGraph.vue";
import MainPage from "./pages/MainPage.vue";

export const sdkPlugin = defineAppV3(platforma, (app) => {
  app.model.data.customBlockLabel ??= "";

  syncDefaultBlockLabel(app.model);

  return {
    routes: {
      "/": () => MainPage,
      "/diversityGraph": () => DiversityGraph,
    },
  };
});

export const useApp = sdkPlugin.useApp;

type AppModel = ReturnType<typeof useApp>["model"];

function syncDefaultBlockLabel(model: AppModel) {
  watchEffect(() => {
    const abundanceLabel = model.data.abundanceRef
      ? model.outputs.abundanceOptions?.find((option) =>
          plRefsEqual(option.ref, model.data.abundanceRef!),
        )?.label
      : undefined;

    model.data.defaultBlockLabel = getDefaultBlockLabel({
      abundanceLabel,
    });
  });
}
