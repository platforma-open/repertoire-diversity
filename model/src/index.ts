import strings from "@milaboratories/strings";
import type { InferOutputsType, PColumnIdAndSpec } from "@platforma-sdk/model";
import { BlockModelV3, createPFrameForGraphs, createPlDataTableV2 } from "@platforma-sdk/model";
import type { Metric } from "@platforma-open/milaboratories.repertoire-diversity-2.kind";
import { kind } from "@platforma-open/milaboratories.repertoire-diversity-2.kind";
import { convertMetricsUiToArgs } from "./converters";
import { blockDataModel } from "./dataModel";
import type { BlockArgs } from "./types";

export type * from "@milaboratories/helpers";
export * from "./converters";
export * from "./types";
export { blockDataModel } from "./dataModel";
export { getDefaultBlockLabel } from "./label";

export const platforma = BlockModelV3.create({ dataModel: blockDataModel, kind })
  .args<BlockArgs>((data) => {
    if (data.abundanceRef === undefined) throw new Error("Abundance column is required");
    const metrics = convertMetricsUiToArgs(data.metrics);
    for (const metric of metrics) {
      if (metric.type === undefined) throw new Error("Each metric requires a type");
      assertDownsamplingComplete(metric.downsampling);
    }
    return { abundanceRef: data.abundanceRef, metrics };
  })

  // Inverse of the kind's init-params contract: the input, the metric rows and
  // the subtitle -- the fields a user sets by hand. Unlike `args` above the
  // rows are projected as STORED (`MetricUI[]`, ids and disclosure included),
  // not stripped to `Metric[]`: this is the user's configuration, not the run's.
  // `defaultBlockLabel` is derived in ui/src/app.ts, and the table / graph
  // states are view state; neither is configuration a template carries.
  .templateParams((data) => ({
    abundanceRef: data.abundanceRef,
    metrics: data.metrics,
    customBlockLabel: data.customBlockLabel,
  }))

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
// The keys `software/src/diversity/main.py` indexes per downsampling mode:
// `top` and `cumtop` read `n`; `hypergeometric` reads `valueChooser`, and `n`
// too when that is "fixed". A key the row never filled is a KeyError partway
// through the run, so it is refused here instead, while the row is still in
// front of the user.
function assertDownsamplingComplete(downsampling: Metric["downsampling"]) {
  switch (downsampling.type) {
    case undefined:
      throw new Error("Each metric requires a downsampling mode");
    case "top":
    case "cumtop":
      if (downsampling.n === undefined) {
        throw new Error(`Downsampling "${downsampling.type}" requires a value`);
      }
      return;
    case "hypergeometric":
      if (downsampling.valueChooser === undefined) {
        throw new Error("Random sampling requires a value chooser");
      }
      if (downsampling.valueChooser === "fixed" && downsampling.n === undefined) {
        throw new Error("Fixed random sampling requires a value");
      }
      return;
    default:
      return;
  }
}

export type BlockOutputs = InferOutputsType<typeof platforma>;
