<script setup lang="ts">
import type { PlRef } from '@platforma-sdk/model';
import { plRefsEqual } from '@platforma-sdk/model';
import { PlBtnSecondary, PlDropdownRef, PlElementList, PlSlideModal } from '@platforma-sdk/ui-vue';
import { useApp } from '../app';
import DiversityCard from './DiversityCard.vue';
import { getMetricLabel } from './util';

const app = useApp();

function setAbundanceRef(abundanceRef?: PlRef) {
  app.model.args.abundanceRef = abundanceRef;
  let label = '';
  if (abundanceRef) {
    label = app.model.outputs.abundanceOptions?.find((o) => plRefsEqual(o.ref, abundanceRef))?.label ?? '';
  }
  app.model.ui.blockTitle = 'Repertoire Diversity – ' + label;
}

const settingsAreShown = defineModel<boolean>({ required: true });

// Counter to make new metric IDs always unique
let metricCounter = 5;

const addMetric = () => {
  app.updateArgs((args) => {
    const newId = `metric-${metricCounter++}`;
    args.metrics.push({
      id: newId,
      type: undefined,
      downsampling: {
        type: 'none',
        valueChooser: 'auto',
      },
      isExpanded: true, // Auto-expand new metrics
    });
  });
};
</script>

<template>
  <PlSlideModal v-model="settingsAreShown">
    <template #title>Settings</template>
    <PlDropdownRef
      v-model="app.model.args.abundanceRef" :options="app.model.outputs.abundanceOptions ?? []"
      label="Abundance"
      required
      @update:model-value="setAbundanceRef"
    />

    <PlElementList
      v-model:items="app.model.args.metrics"
      :get-item-key="(item) => item.id"
      :is-expanded="(item) => item.isExpanded === true"
      :on-expand="(item) => item.isExpanded = !item.isExpanded"
      :disable-dragging="true"
    >
      <template #item-title="{ item }">
        {{ item.type ? getMetricLabel(item.type) : 'New Metric' }}
      </template>
      <template #item-content="{ index }">
        <DiversityCard v-model="app.model.args.metrics[index]" />
      </template>
    </PlElementList>

    <PlBtnSecondary icon="add" @click="addMetric">
      Add Metric
    </PlBtnSecondary>
  </PlSlideModal>
</template>
