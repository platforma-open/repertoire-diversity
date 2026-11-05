# @platforma-open/milaboratories.repertoire-diversity-2.kind

## 1.1.0

### Minor Changes

- a4a06ad: Update the SDK and accept a subset filter (e.g. a Repertoire Labeling label or Lead Selection picks) with the abundance. The abundance list is built with buildDatasetOptions (requireEnrichments: false), with the same labels as before. The subset restricts the clonotypes before the metrics are computed, so diversity values and downsampling depths describe the subset only. Metrics of a subset run carry pl7.app/inputSubset and a trace rooted in the subset, and the default subtitle names it. Unfiltered runs are unchanged.
