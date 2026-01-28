import { convertMetricsUiToArgs, getDefaultBlockLabel, model } from '@platforma-open/milaboratories.repertoire-diversity-2.model';
import { plRefsEqual } from '@platforma-sdk/model';
import { defineApp } from '@platforma-sdk/ui-vue';
import debounce from 'lodash.debounce';
import { toRaw, watch, watchEffect } from 'vue';
import DiversityGraph from './pages/DiversityGraph.vue';
import MainPage from './pages/MainPage.vue';

export const sdkPlugin = defineApp(model, (app) => {
  app.model.args.customBlockLabel ??= '';

  syncDefaultBlockLabel(app.model);

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

type AppModel = ReturnType<typeof useApp>['model'];

function syncDefaultBlockLabel(model: AppModel) {
  watchEffect(() => {
    const abundanceLabel = model.args.abundanceRef
      ? model.outputs.abundanceOptions
        ?.find((option) => plRefsEqual(option.ref, model.args.abundanceRef!))
        ?.label
      : undefined;

    model.args.defaultBlockLabel = getDefaultBlockLabel({
      abundanceLabel,
    });
  });
}
