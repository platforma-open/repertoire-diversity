import type { Metric, MetricUI } from './index';

export const convertMetricsUiToArgs = (metrics: MetricUI[]): Metric[] => {
  return metrics.map((metric): Metric => {
    return {
      type: metric.type,
      downsampling: metric.downsampling,
    };
  });
};
