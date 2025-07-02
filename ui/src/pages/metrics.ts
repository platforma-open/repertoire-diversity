import type { Ref } from 'vue';
import { computed, toRaw, watch } from 'vue';
import once from 'lodash.once';
import debounce from 'lodash.debounce';
import type { MetricUI } from '@platforma-open/milaboratories.repertoire-diversity-2.model';
import { convertMetricsArgsToUi, convertMetricsUiToArgs } from '@platforma-open/milaboratories.repertoire-diversity-2.model';
import { randomInt } from '@milaboratories/helpers';
import { useApp } from '../app';

export const useMetrics = () => {
  useMigrationMetrics();

  const app = useApp();
  const metrics = computed((): MetricUI[] => app.model.ui.metrics!);

  useSyncMetrics(metrics);

  const addMetric = () => {
    metrics.value.push({
      id: randomInt(),
      isExpanded: false,

      type: undefined,
      downsampling: {
        type: 'none',
        valueChooser: 'auto',
      },
    });
  };

  return { metrics, addMetric };
};

const useMigrationMetrics = once(() => {
  const app = useApp();
  // Migrate metrics from old format if necessary
  if (app.model.ui.metrics === undefined) {
    app.model.ui.metrics = convertMetricsArgsToUi(app.model.args.metrics ?? []);
  }
});

const useSyncMetrics = once((metrics: Ref<MetricUI[]>) => {
  // Watch for changes in the metrics in UI state and update the args accordingly
  watch(
    metrics,
    syncMetricsDebounced,
    { deep: true, immediate: true },
  );
});

const syncMetricsDebounced = debounce((value) => {
  useApp().updateArgs((args) => {
    args.metrics = convertMetricsUiToArgs(toRaw(value));
    return args;
  });
}, 2000);
