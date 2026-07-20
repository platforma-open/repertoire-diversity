# @platforma-open/milaboratories.repertoire-diversity-2.software

## 2.0.1

### Patch Changes

- f0f5261: Migrate onto the block-tools structurer (full SDK upgrade: model/ui-vue 1.79.14,
  workflow-tengo 6.6.3, tengo-builder 4.0.8) and BlockModelV3.

  Persisted state is preserved via the legacy upgrader. UI bindings move to
  `app.model.data`; the metric list (`MetricUI[]`) now lives in `data` and is
  projected to the workflow's `Metric[]` by the args lambda — the debounced
  ui→args sync watcher is gone. Block labels and table/graph view state are
  UI-only and no longer stale the block; only the abundance input and metric set
  do.

## 2.0.0

### Major Changes

- be69712: Support peptides

## 1.5.3

### Patch Changes

- c85fbd0: Custom block title support

## 1.5.2

### Patch Changes

- d157baf: Show running state for tables and graphs, migrate to new project template

## 1.5.1

### Patch Changes

- 63c4b69: technical release

## 1.5.0

### Minor Changes

- 8d7b553: allow empty input, replace NA/null with 0

## 1.4.0

### Minor Changes

- 192909e: Support parquet format (update SDK); Fix for Gini Index calculation

## 1.3.5

### Patch Changes

- 3e39f73: technical release
- 37c4e58: technical release
- 7c4d608: technical release
- a2200a0: technical release

## 1.3.4

### Patch Changes

- d0287b6: support numpy on Mac OS X 13 and sdk update

## 1.3.3

### Patch Changes

- 6ff86d7: Updated SDK

## 1.3.2

### Patch Changes

- 12dded0: Update used python package versions

## 1.3.1

### Patch Changes

- f95c059: Update SDK

## 1.3.0

### Minor Changes

- 2206a21: Fix posible float error

## 1.2.0

### Minor Changes

- 84296a7: Fix random min bug

## 1.1.2

### Patch Changes

- 6dba4b4: Fix package name

## 1.1.1

### Patch Changes

- 1417619: Init

## 1.1.0

### Minor Changes

- 1d45e7d: Added table and bar plot
