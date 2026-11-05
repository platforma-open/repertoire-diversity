---
"@platforma-open/milaboratories.repertoire-diversity-2": minor
"@platforma-open/milaboratories.repertoire-diversity-2.kind": minor
"@platforma-open/milaboratories.repertoire-diversity-2.model": minor
"@platforma-open/milaboratories.repertoire-diversity-2.ui": minor
"@platforma-open/milaboratories.repertoire-diversity-2.workflow": minor
---

Update the SDK and accept a subset filter (e.g. a Repertoire Labeling label or Lead Selection picks) with the abundance. The abundance list is built with buildDatasetOptions (requireEnrichments: false), with the same labels as before. The subset restricts the clonotypes before the metrics are computed, so diversity values and downsampling depths describe the subset only. Metrics of a subset run carry pl7.app/inputSubset and a trace rooted in the subset, and the default subtitle names it. Unfiltered runs are unchanged.
