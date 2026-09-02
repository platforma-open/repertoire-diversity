import type { Metric, MetricUI } from "@platforma-open/milaboratories.repertoire-diversity-2.kind";

export const convertMetricsUiToArgs = (metrics: MetricUI[]): Metric[] => {
  return metrics.map((metric): Metric => {
    return {
      type: metric.type,
      downsampling: metric.downsampling,
    };
  });
};
