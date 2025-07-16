import { convertMetricsUiToArgs, model } from '@platforma-open/milaboratories.repertoire-diversity-2.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import debounce from 'lodash.debounce';
import { toRaw, watch } from 'vue';
import DiversityGraph from './pages/DiversityGraph.vue';
import MainPage from './pages/MainPage.vue';

export const sdkPlugin = defineApp(model, (app) => {
  watch(
    () => app.model.ui.metrics,
    debounce((value) => app.model.args.metrics = convertMetricsUiToArgs(toRaw(value)), 500),
    { deep: true, immediate: true },
  );

  return {
    routes: {
      '/': () => MainPage,
      '/diversityGraph': () => DiversityGraph,
    },
  };
});

export const useApp = sdkPlugin.useApp;
