---
"@platforma-open/milaboratories.repertoire-diversity-2.model": minor
"@platforma-open/milaboratories.repertoire-diversity-2.ui": minor
"@platforma-open/milaboratories.repertoire-diversity-2.workflow": patch
"@platforma-open/milaboratories.repertoire-diversity-2.software": patch
"@platforma-open/milaboratories.repertoire-diversity-2": minor
---

Migrate onto the block-tools structurer (full SDK upgrade: model/ui-vue 1.79.14,
workflow-tengo 6.6.3, tengo-builder 4.0.8) and BlockModelV3.

Persisted state is preserved via the legacy upgrader. UI bindings move to
`app.model.data`; the metric list (`MetricUI[]`) now lives in `data` and is
projected to the workflow's `Metric[]` by the args lambda — the debounced
ui→args sync watcher is gone. Block labels and table/graph view state are
UI-only and no longer stale the block; only the abundance input and metric set
do.
