<script setup lang="ts">
import type { GraphMakerProps, PredefinedGraphOption } from '@milaboratories/graph-maker';
import { GraphMaker } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import type { PColumnIdAndSpec } from '@platforma-sdk/model';
import { computed } from 'vue';
import { useApp } from '../app';

const app = useApp();

const defaultOptions = computed((): PredefinedGraphOption<'discrete'>[] | undefined => {
  if (!app.model.outputs.pcols)
    return undefined;

  const pcols = app.model.outputs.pcols;
  function getIndex(name: string, pcols: PColumnIdAndSpec[]): number {
    return pcols.findIndex((p) => (p.spec.name === name
    ));
  }

  const defaults: PredefinedGraphOption<'discrete'>[] = [
    {
      inputName: 'primaryGrouping',
      selectedSource: pcols[getIndex('pl7.app/diversity',
        pcols)].spec.axesSpec[0],
    },
    {
      inputName: 'y',
      selectedSource: pcols[getIndex('pl7.app/diversity',
        pcols)].spec,
    },
  ];
  return defaults;
});

</script>

<template>
  <GraphMaker
    v-model="app.model.ui.graphState"
    chart-type="discrete"
    :p-frame="app.model.outputs.pf"
    :default-options="defaultOptions"
  />
</template>
