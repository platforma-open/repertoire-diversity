# @platforma-open/milaboratories.repertoire-diversity-2.workflow

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

- Updated dependencies [f0f5261]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@2.0.1

## 2.0.0

### Major Changes

- be69712: Support peptides

### Patch Changes

- Updated dependencies [be69712]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@2.0.0

## 1.6.4

### Patch Changes

- c85fbd0: Custom block title support
- Updated dependencies [c85fbd0]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.5.3

## 1.6.3

### Patch Changes

- d157baf: Show running state for tables and graphs, migrate to new project template
- Updated dependencies [d157baf]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.5.2

## 1.6.2

### Patch Changes

- 63c4b69: technical release
- Updated dependencies [63c4b69]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.5.1

## 1.6.1

### Patch Changes

- Updated dependencies [8d7b553]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.5.0

## 1.6.0

### Minor Changes

- 192909e: Support parquet format (update SDK); Fix for Gini Index calculation

### Patch Changes

- Updated dependencies [192909e]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.4.0

## 1.5.4

### Patch Changes

- 3e39f73: technical release
- 37c4e58: technical release
- 7c4d608: technical release
- a2200a0: technical release
- Updated dependencies [3e39f73]
- Updated dependencies [37c4e58]
- Updated dependencies [7c4d608]
- Updated dependencies [a2200a0]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.3.5

## 1.5.3

### Patch Changes

- Updated dependencies [d0287b6]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.3.4

## 1.5.2

### Patch Changes

- 6ff86d7: Updated SDK
- Updated dependencies [6ff86d7]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.3.3

## 1.5.1

### Patch Changes

- Updated dependencies [12dded0]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.3.2

## 1.5.0

### Minor Changes

- 057ca18: Modify trace importance and trace label to be more informative

## 1.4.1

### Patch Changes

- f95c059: Update SDK
- Updated dependencies [f95c059]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.3.1

## 1.4.0

### Minor Changes

- 60f2dc1: Support batch system
- 1b4bc1d: Support batch system

## 1.3.1

### Patch Changes

- Updated dependencies [2206a21]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.3.0

## 1.3.0

### Minor Changes

- 7bc102b: Add annotation for number formatting and migrate xsvTableBuilder

## 1.2.0

### Minor Changes

- 0888e31: chore: update deps

## 1.1.3

### Patch Changes

- Updated dependencies [84296a7]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.2.0

## 1.1.2

### Patch Changes

- 6dba4b4: Fix package name
- Updated dependencies [6dba4b4]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.1.2

## 1.1.1

### Patch Changes

- 1417619: Init
- Updated dependencies [1417619]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.1.1

## 1.1.0

### Minor Changes

- 1d45e7d: Added table and bar plot

### Patch Changes

- Updated dependencies [1d45e7d]
  - @platforma-open/milaboratories.repertoire-diversity-2.software@1.1.0
