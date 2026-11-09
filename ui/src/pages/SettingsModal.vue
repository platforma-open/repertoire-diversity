<script setup lang="ts">
import strings from "@milaboratories/strings";
import type { DatasetSelection } from "@platforma-sdk/model";
import {
  createDatasetSelection,
  createPrimaryRef,
  getRawPlatformaInstance,
} from "@platforma-sdk/model";
import {
  PlBtnSecondary,
  PlDatasetSelector,
  PlElementList,
  PlSlideModal,
  PlAlert,
} from "@platforma-sdk/ui-vue";
import { asyncComputed } from "@vueuse/core";
import { computed } from "vue";
import { useApp } from "../app";
import DiversityCard from "./DiversityCard.vue";
import { getMetricLabel } from "./util";

const app = useApp();

const abundanceSelection = computed<DatasetSelection | undefined>({
  get: () => {
    const { abundanceRef, filterRef } = app.model.data;
    if (abundanceRef === undefined) return undefined;
    return createDatasetSelection(createPrimaryRef(abundanceRef, filterRef));
  },
  set: (selection) => {
    app.model.data.abundanceRef = selection?.primary.column;
    app.model.data.filterRef = selection?.primary.filter;
  },
});

const settingsAreShown = defineModel<boolean>({ required: true });

const generateUniqueId = () => {
  return `metric-${Date.now()}`;
};

const addMetric = () => {
  app.model.data.metrics?.push({
    id: generateUniqueId(),
    type: undefined,
    downsampling: {
      type: "none",
      valueChooser: "auto",
    },
    isExpanded: true, // Auto-expand new metrics
  });
};

const isEmpty = asyncComputed(async () => {
  if (app.model.outputs.pt === undefined) return undefined;
  if (!app.model.outputs.pt.ok) return undefined;
  const handle = app.model.outputs.pt.value.visibleTableHandle;
  if (handle === undefined) return undefined;
  return (await getRawPlatformaInstance().pFrameDriver.getShape(handle)).rows === 0;
});
</script>

<template>
  <PlSlideModal v-model="settingsAreShown">
    <template #title>{{ strings.titles.settings }}</template>
    <PlDatasetSelector
      v-model="abundanceSelection"
      :options="app.model.outputs.abundanceOptions"
      label="Abundance"
      required
    />

    <PlAlert v-if="isEmpty === true" type="warn" :style="{ width: '320px' }">
      <template #title>Empty dataset selection</template>
      The input dataset you have selected is empty. Please choose a different dataset.
    </PlAlert>

    <PlElementList
      v-model:items="app.model.data.metrics"
      :get-item-key="(item) => item.id"
      :is-expanded="(item) => item.isExpanded === true"
      :on-expand="(item) => (item.isExpanded = !item.isExpanded)"
      :disable-dragging="true"
    >
      <template #item-title="{ item }">
        {{ item.type ? getMetricLabel(item.type) : "New Metric" }}
      </template>
      <template #item-content="{ index }">
        <DiversityCard v-model="app.model.data.metrics[index]" />
      </template>
    </PlElementList>

    <PlBtnSecondary icon="add" @click="addMetric"> Add Metric </PlBtnSecondary>
  </PlSlideModal>
</template>
