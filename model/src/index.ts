import type { InferOutputsType, PColumnIdAndSpec } from '@platforma-sdk/model';
import { BlockModel, createPFrameForGraphs, createPlDataTableV2 } from '@platforma-sdk/model';
import type { BlockArgs, UiState } from './types';
import { createDefaultUiState } from './uiState';

export * from './types';
export * from './uiState';

export const model = BlockModel.create()
  .withArgs<BlockArgs>({
    metrics: [],
  })

  .withUiState<UiState>(createDefaultUiState())

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

    return createPlDataTableV2(ctx, pCols, ctx.uiState.tableState);
  })

  .output('pf', (ctx) => {
    const pCols = ctx.outputs?.resolve('pf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPFrameForGraphs(ctx, pCols);
  })

  // Return a list of Pcols for plot defaults
  .output('pcols', (ctx) => {
    const pCols = ctx.outputs?.resolve('pf')?.getPColumns();

    if (pCols === undefined || pCols.length === 0) {
      return undefined;
    }

    return pCols.map(
      (c) =>
        ({
          columnId: c.id,
          spec: c.spec,
        } satisfies PColumnIdAndSpec),
    );
  })

  .output('isRunning', (ctx) => ctx.outputs?.getIsReadyOrError() === false)

  .title((ctx) => ctx.uiState?.blockTitle ?? 'Repertoire Diversity')

  .sections((_) => [
    { type: 'link', href: '/', label: 'Main' },
    { type: 'link', href: '/diversityGraph', label: 'Diversity Graph' },
  ])

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
