<script setup lang="ts">
import type { PlRef } from '@platforma-sdk/model';
import { plRefsEqual } from '@platforma-sdk/model';
import { PlBtnSecondary, PlDropdownRef, PlSlideModal, PlElementList } from '@platforma-sdk/ui-vue';
import { useApp } from '../app';
import DiversityCard from './DiversityCard.vue';
import { getMetricLabel } from './util';
import { useMetrics } from './metrics';

const app = useApp();
const { metrics, addMetric } = useMetrics();

function setAbundanceRef(abundanceRef?: PlRef) {
  app.model.args.abundanceRef = abundanceRef;
  let label = '';
  if (abundanceRef) {
    label = app.model.outputs.abundanceOptions?.find((o) => plRefsEqual(o.ref, abundanceRef))?.label ?? '';
  }
  app.model.ui.blockTitle = 'Repertoire Diversity – ' + label;
}

const settingsAreShown = defineModel<boolean>({ required: true });
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
      v-model:items="metrics"
      :get-item-key="(item) => item.id ?? 0"
      :is-expanded="(item) => item.isExpanded === true"
      :on-expand="(item) => item.isExpanded = !item.isExpanded"
    >
      <template #item-title="{ item }">
        {{ item.type ? getMetricLabel(item.type) : 'New Metric' }}
      </template>
      <template #item-content="{ index }">
        <DiversityCard v-model="metrics[index]" />
      </template>
    </PlElementList>

    <PlBtnSecondary icon="add" @click="addMetric">
      Add Metric
    </PlBtnSecondary>
  </PlSlideModal>
</template>
