<script setup lang="ts">
import type { PlRef } from '@platforma-sdk/model';
import { getRawPlatformaInstance } from '@platforma-sdk/model';
import { PlBtnSecondary, PlDropdownRef, PlElementList, PlSlideModal, PlAlert } from '@platforma-sdk/ui-vue';
import { asyncComputed } from '@vueuse/core';
import { useApp } from '../app';
import DiversityCard from './DiversityCard.vue';
import { getMetricLabel } from './util';

const app = useApp();

function setAbundanceRef(abundanceRef?: PlRef) {
  app.model.args.abundanceRef = abundanceRef;
}

const settingsAreShown = defineModel<boolean>({ required: true });

const generateUniqueId = () => {
  return `metric-${Date.now()}`;
};

const addMetric = () => {
  app.model.ui.metrics?.push({
    id: generateUniqueId(),
    type: undefined,
    downsampling: {
      type: 'none',
      valueChooser: 'auto',
    },
    isExpanded: true, // Auto-expand new metrics
  });
};

const isEmpty = asyncComputed(async () => {
  if (app.model.outputs.pt === undefined) return undefined;
  if (!app.model.outputs.pt.ok) return undefined;
  return (await getRawPlatformaInstance().pFrameDriver.getShape(app.model.outputs.pt.value.visibleTableHandle)).rows === 0;
});
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

    <PlAlert v-if="isEmpty === true" type="warn" :style="{ width: '320px' }">
      <template #title>Empty dataset selection</template>
      The input dataset you have selected is empty.
      Please choose a different dataset.
    </PlAlert>

    <PlElementList
      v-model:items="app.model.ui.metrics"
      :get-item-key="(item) => item.id"
      :is-expanded="(item) => item.isExpanded === true"
      :on-expand="(item) => item.isExpanded = !item.isExpanded"
      :disable-dragging="true"
    >
      <template #item-title="{ item }">
        {{ item.type ? getMetricLabel(item.type) : 'New Metric' }}
      </template>
      <template #item-content="{ index }">
        <DiversityCard v-model="app.model.ui.metrics[index]" />
      </template>
    </PlElementList>

    <PlBtnSecondary icon="add" @click="addMetric">
      Add Metric
    </PlBtnSecondary>
  </PlSlideModal>
</template>
