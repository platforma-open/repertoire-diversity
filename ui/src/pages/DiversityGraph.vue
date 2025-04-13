<script setup lang="ts">
import type { GraphMakerProps } from '@milaboratories/graph-maker';
import { GraphMaker } from '@milaboratories/graph-maker';
import '@milaboratories/graph-maker/styles';
import { computed } from 'vue';
import { useApp } from '../app';

const app = useApp();

const defaultOptions = computed((): GraphMakerProps['defaultOptions'] => {
  return [
    {
      inputName: 'y',
      selectedSource: {
        kind: 'PColumn',
        valueType: 'Double',
        name: 'pl7.app/diversity',
        axesSpec: [],
      },
    },
    {
      inputName: 'primaryGrouping',
      selectedSource: {
        type: 'String',
        name: 'pl7.app/sampleId',
      },
    }
  ];
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
