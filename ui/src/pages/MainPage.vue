<script setup lang="ts">
import strings from '@milaboratories/strings';
import { PlAgDataTableV2, PlBlockPage, PlBtnGhost, PlMaskIcon24, usePlDataTableSettingsV2 } from '@platforma-sdk/ui-vue';
import { ref, watch } from 'vue';
import { useApp } from '../app';
import SettingsModal from './SettingsModal.vue';

const app = useApp();

const tableSettings = usePlDataTableSettingsV2({
  model: () => app.model.outputs.pt,
});

const settingsAreShown = ref(app.model.args.abundanceRef === undefined);
const showSettings = () => {
  settingsAreShown.value = true;
};

// Auto-close settings panel when block starts running
watch(
  () => app.model.outputs.isRunning,
  (isRunning, wasRunning) => {
    // Close settings when block starts running (false -> true transition)
    if (isRunning && !wasRunning) {
      settingsAreShown.value = false;
    }
  },
);
</script>

<template>
  <PlBlockPage
    title="Repertoire Diversity"
  >
    <template #append>
      <PlBtnGhost @click.stop="showSettings">
        {{ strings.titles.settings }}
        <template #append>
          <PlMaskIcon24 name="settings" />
        </template>
      </PlBtnGhost>
    </template>
    <PlAgDataTableV2
      v-model="app.model.ui.tableState"
      :settings="tableSettings"
      :not-ready-text="strings.callToActions.configureSettingsAndRun"
      :no-rows-text="strings.states.noDataAvailable"
      show-export-button
    />
  </PlBlockPage>

  <SettingsModal v-model="settingsAreShown" />
</template>
