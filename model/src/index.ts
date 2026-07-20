import strings from "@milaboratories/strings";
import type { InferOutputsType, PColumnIdAndSpec } from "@platforma-sdk/model";
import { BlockModelV3, createPFrameForGraphs, createPlDataTableV2 } from "@platforma-sdk/model";
import { convertMetricsUiToArgs } from "./converters";
import { blockDataModel } from "./dataModel";
import type { BlockArgs } from "./types";

export type * from "@milaboratories/helpers";
export * from "./converters";
export * from "./types";
export { blockDataModel } from "./dataModel";
export { getDefaultBlockLabel } from "./label";

export const platforma = BlockModelV3.create(blockDataModel)
  .args<BlockArgs>((data) => {
    if (data.abundanceRef === undefined) throw new Error("Abundance column is required");
    const metrics = convertMetricsUiToArgs(data.metrics);
    if (metrics.some((metric) => metric.type === undefined))
      throw new Error("Each metric requires a type");
    return { abundanceRef: data.abundanceRef, metrics };
  })

  .output("abundanceOptions", (ctx) =>
    ctx.resultPool.getOptions(
      [
        {
          axes: [{ name: "pl7.app/sampleId" }, {}],
          annotations: {
            "pl7.app/isAbundance": "true",
            "pl7.app/abundance/normalized": "false",
            "pl7.app/abundance/isPrimary": "true",
          },
        },
      ],
      { includeNativeLabel: true },
    ),
  )

  .outputWithStatus("pt", (ctx) => {
    const pCols = ctx.outputs?.resolve("pf")?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPlDataTableV2(ctx, pCols, ctx.data.tableState);
  })

  .outputWithStatus("pf", (ctx) => {
    const pCols = ctx.outputs?.resolve("pf")?.getPColumns();
    if (pCols === undefined) {
      return undefined;
    }

    return createPFrameForGraphs(ctx, pCols);
  })

  // Return a list of Pcols for plot defaults
  .output("pcols", (ctx) => {
    const pCols = ctx.outputs?.resolve("pf")?.getPColumns();

    if (pCols === undefined || pCols.length === 0) {
      return undefined;
    }

    return pCols.map(
      (c) =>
        ({
          columnId: c.id,
          spec: c.spec,
        }) satisfies PColumnIdAndSpec,
    );
  })

  .output("isRunning", (ctx) => ctx.outputs?.getIsReadyOrError() === false)

  .title(() => "Sequence Diversity")

  .subtitle((ctx) => ctx.data.customBlockLabel || ctx.data.defaultBlockLabel)

  .sections(() => [
    { type: "link" as const, href: "/" as const, label: strings.titles.main },
    { type: "link" as const, href: "/diversityGraph" as const, label: "Diversity Graph" },
  ])

  .done();

export type Platforma = typeof platforma;
export type BlockOutputs = InferOutputsType<typeof platforma>;
