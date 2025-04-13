import { model } from '@platforma-open/milaboratories.repertoire-diversity-2.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import DiversityGraph from './pages/DiversityGraph.vue';
import MainPage from './pages/MainPage.vue';

export const sdkPlugin = defineApp(model, () => {
  return {
    routes: {
      '/': () => MainPage,
      '/diversityGraph': () => DiversityGraph,
    },
  };
});

export const useApp = sdkPlugin.useApp;
