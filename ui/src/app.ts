import { platforma } from "@platforma-open/milaboratories.repertoire-diversity-2.model";
import { defineAppV3 } from "@platforma-sdk/ui-vue";
import DiversityGraph from "./pages/DiversityGraph.vue";
import MainPage from "./pages/MainPage.vue";

export const sdkPlugin = defineAppV3(platforma, (app) => {
  app.model.data.customBlockLabel ??= "";

  return {
    routes: {
      "/": () => MainPage,
      "/diversityGraph": () => DiversityGraph,
    },
  };
});

export const useApp = sdkPlugin.useApp;
