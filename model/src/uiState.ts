import { randomInt } from '@milaboratories/helpers';
import { createPlDataTableStateV2 } from '@platforma-sdk/model';
import type { Metric, MetricUI, UiState } from './types';

export const createDefaultUiState = (): UiState => {
  return {
    blockTitle: 'Repertoire Diversity',

    graphState: {
      title: 'Repertoire Diversity',
      template: 'bar',
      currentTab: null,
    },

    tableState: createPlDataTableStateV2(),

    metrics: createDefaultMetricUis(),
  };
};

export const createDefaultMetricUis = (): MetricUI[] => {
  return [
    {
      id: randomInt(),
      isExpanded: false,
      type: 'observed',
      downsampling: {
        type: 'hypergeometric',
        valueChooser: 'auto',
      },
    },
    {
      id: randomInt(),
      isExpanded: false,
      type: 'shannonWiener',
      downsampling: {
        type: 'hypergeometric',
        valueChooser: 'auto',
      },
    },
    {
      id: randomInt(),
      isExpanded: false,
      type: 'chao1',
      downsampling: {
        type: 'hypergeometric',
        valueChooser: 'auto',
      },
    },
    {
      id: randomInt(),
      isExpanded: false,
      type: 'gini',
      downsampling: {
        type: 'hypergeometric',
        valueChooser: 'auto',
      },
    },
    {
      id: randomInt(),
      isExpanded: false,
      type: 'd50',
      downsampling: {
        type: 'hypergeometric',
        valueChooser: 'auto',
      },
    },
  ];
};

export const convertMetricsUiToArgs = (metrics: MetricUI[]): Metric[] => {
  return metrics.map((metric): Metric => {
    return {
      type: metric.type,
      downsampling: metric.downsampling,
    };
  });
};

export const convertMetricsArgsToUi = (metrics: Metric[]): MetricUI[] => {
  return metrics.map((metric): MetricUI => {
    return {
      ...metric,
      id: randomInt(),
      isExpanded: false,
    };
  });
};
