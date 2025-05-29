import type { GraphMakerState } from '@milaboratories/graph-maker';
import type { InferOutputsType, PColumnSpec, PlDataTableState, PlRef } from '@platforma-sdk/model';
import { BlockModel, createPFrameForGraphs, createPlDataTable } from '@platforma-sdk/model';

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

export type BlockArgs = {
  abundanceRef?: PlRef;
  metrics: Metric[];
};

export type UiState = {
  blockTitle: string;
  tableState?: PlDataTableState;
  graphState: GraphMakerState;
};

function isNumericType(c: PColumnSpec): boolean {
  return c.valueType === 'Double' || c.valueType === 'Int' || c.valueType === 'Float' || c.valueType === 'Long';
}

export const model = BlockModel.create()

  .withArgs<BlockArgs>({
    metrics: [
      {
        type: 'observed',
        downsampling: {
          type: 'hypergeometric',
          valueChooser: 'auto',
        },
      },
      {
        type: 'shannonWiener',
        downsampling: {
          type: 'hypergeometric',
          valueChooser: 'auto',
        },
      },
      {
        type: 'chao1',
        downsampling: {
          type: 'hypergeometric',
          valueChooser: 'auto',
        },
      },
      {
        type: 'gini',
        downsampling: {
          type: 'hypergeometric',
          valueChooser: 'auto',
        },
      },
      {
        type: 'd50',
        downsampling: {
          type: 'hypergeometric',
          valueChooser: 'auto',
        },
      },
    ],
  })

  .withUiState<UiState>({
    blockTitle: 'Repertoire Diversity',
    graphState: {
      title: 'Repertoire Diversity',
      template: 'bar',
      currentTab: null,
    },

    tableState: {
      gridState: {},
      pTableParams: {
        sorting: [],
        filters: [],
      },
    },
  })

  .argsValid((ctx) => ctx.args.abundanceRef !== undefined)

  .output('abundanceOptions', (ctx) =>
    ctx.resultPool.getOptions([{
      axes: [
        { name: 'pl7.app/sampleId' },
        { },
      ],
      annotations: {
        'pl7.app/isAbundance': 'true',
        'pl7.app/abundance/normalized': 'false',
        'pl7.app/abundance/isPrimary': 'true',
      },
    },
    ]),
  )

  .output('pt', (ctx) => {
    const pCols = ctx.outputs?.resolve('pf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPlDataTable(ctx, pCols, ctx.uiState?.tableState);
  })

  .output('pf', (ctx) => {
    const pCols = ctx.outputs?.resolve('pf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPFrameForGraphs(ctx, pCols);
  })

  .output('isRunning', (ctx) => ctx.outputs?.getIsReadyOrError() === false)

  .title((ctx) => ctx.uiState?.blockTitle ?? 'Repertoire Diversity')

  .sections((_) => [
    { type: 'link', href: '/', label: 'Main' },
    { type: 'link', href: '/diversityGraph', label: 'Diversity Graph' },
  ])

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
