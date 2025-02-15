import { GraphMakerState } from '@milaboratories/graph-maker';
import {
  BlockModel,
  createPlDataTable,
  createPlDataTableSheet,
  getUniquePartitionKeys,
  InferOutputsType,
  isPColumn,
  isPColumnSpec,
  PlDataTableState,
  PlRef,
  ValueType
} from '@platforma-sdk/model';

type WeightFunction = 'auto' | 'read' | 'umi' | 'cell' | 'none';

type DownsamplingForm = {
  type: 'auto' | 'count' | 'top' | 'cumtop' | 'none';
  tag: 'read' | 'umi' | 'cell';
  countNorm: 'auto' | 'min' | 'fixed';
  countNormValue: number;
  topValue: number;
  cumtopValue: number;
};

/**
 * UI state
 */
export type UiState = {
  blockTitle: string;
  tableState?: PlDataTableState;
  graphState: GraphMakerState;
  weight: WeightFunction;
  downsampling: DownsamplingForm;
};

export type BlockArgs = {
  clnsRef?: PlRef;
  /* downsampling options */
  onlyProductive: boolean;
  dropOutliers: boolean;
  downsampling?: string;
  weight?: WeightFunction;
  isReady?: boolean;
};

export const model = BlockModel.create()
  .withArgs<BlockArgs>({
    onlyProductive: true,
    dropOutliers: false,
    isReady: false
  })

  .withUiState<UiState>({
    blockTitle: 'Repertoire Diversity',
    weight: 'auto',
    downsampling: {
      type: 'auto',
      tag: 'read',
      countNorm: 'auto',
      countNormValue: 1000,
      topValue: 1000,
      cumtopValue: 80
    },
    tableState: {
      gridState: {},
      pTableParams: {
        sorting: [],
        filters: []
      }
    },
    graphState: {
      title: 'Diversity Analysis',
      template: 'bar',
      axesSettings: {
        axisX: {labelsRotation: '90deg'}
      }
    }
  })

  // Activate "Run" button only after these conditions get fulfilled
  .argsValid((ctx) =>  ctx.args.clnsRef !== undefined &&
                      // isReady is set to false while we compute dataset specific settings
                      ctx.args.isReady === true && 
                      ctx.args.downsampling !== undefined && 
                      ctx.args.weight !== undefined)

  .output('clnsOptions', (ctx) =>
    ctx.resultPool.getOptions((spec) => isPColumnSpec(spec) && spec.name === 'mixcr.com/clns')
  )

  .output('datasetSpec', (ctx) => {
    if (ctx.args.clnsRef) return ctx.resultPool.getSpecByRef(ctx.args.clnsRef);
    else return undefined;
  })

  .output('pt', (ctx) => {
    const pCols = ctx.outputs?.resolve('pf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    const anchor = pCols[0];
    if (!anchor) return undefined;

    const r = getUniquePartitionKeys(anchor.data);
    if (!r) return undefined;

    return {
      table: createPlDataTable(ctx, pCols, ctx.uiState?.tableState),
      sheets: r.map((values, i) => createPlDataTableSheet(ctx, anchor.spec.axesSpec[i], values))
    };
  })

  .output('pf', (ctx) => {
    const pCols = ctx.outputs?.resolve('pf')?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }
    const colsToUse = pCols.map(col => col.spec.axesSpec[0].name)

    // enriching with upstream data
    const valueTypes = ['Int', 'Long', 'Float', 'Double', 'String', 'Bytes'] as ValueType[];
    const upstream = ctx.resultPool
      .getData()
      .entries.map((v) => v.obj)
      .filter(isPColumn)
      .filter((column) => valueTypes.find((valueType) => valueType === column.spec.valueType))
      .filter((column) => !colsToUse.includes((column.spec.annotations ?? {})["pl7.app/label"]))
    return ctx.createPFrame([...pCols, ...upstream]);
  })

  .output('isRunning', (ctx) => ctx.outputs?.getIsReadyOrError() === false)

  .title((ctx) => ctx.uiState?.blockTitle ?? 'Repertoire Diversity')

  .sections([
    { type: 'link', href: '/', label: 'Tabular Results' },
    { type: 'link', href: '/graph', label: 'Diversity Plots' }
  ])

  .done();

export type BlockOutputs = InferOutputsType<typeof model>;
