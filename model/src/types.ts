import type { GraphMakerState } from '@milaboratories/graph-maker';
import type { PlDataTableStateV2, PlRef } from '@platforma-sdk/model';

export type DiversityType = 'chao1' | 'd50' | 'efronThisted' |
  'observed' | 'shannonWienerIndex' | 'shannonWiener' |
  'normalizedShannonWiener' | 'inverseSimpson' | 'gini';

export type Metric = {
  type: DiversityType | undefined;
  downsampling: {
    type?: 'none' | 'top' | 'cumtop' | 'hypergeometric' ;
    valueChooser?: 'min' | 'fixed' | 'max' | 'auto';
    n?: number;
  };
};

export type MetricUI = Metric & {
  id?: number;
  isExpanded?: boolean;
};

export type BlockArgs = {
  abundanceRef?: PlRef;
  metrics: Metric[];
};

export type UiState = {
  blockTitle: string;
  graphState: GraphMakerState;
  tableState: PlDataTableStateV2;
  metrics?: MetricUI[];
};
