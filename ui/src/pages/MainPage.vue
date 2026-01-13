<script setup lang="ts">
import { plRefsEqual } from '@platforma-sdk/model';
import { PlAgDataTableV2, PlBlockPage, PlBtnGhost, PlMaskIcon24, usePlDataTableSettingsV2 } from '@platforma-sdk/ui-vue';
import { ref, watchEffect } from 'vue';
import { useApp } from '../app';
import SettingsModal from './SettingsModal.vue';

const app = useApp();

const tableSettings = usePlDataTableSettingsV2({
  model: () => app.model.outputs.pt,
});

const settingsAreShown = ref(app.model.outputs.pt === undefined);
const showSettings = () => {
  settingsAreShown.value = true;
};

watchEffect(() => {
  const abundanceRef = app.model.args.abundanceRef;
  if (abundanceRef) {
    app.model.args.defaultBlockLabel = app.model.outputs.abundanceOptions?.find((o) => plRefsEqual(o.ref, abundanceRef))?.label ?? '';
  } else {
    app.model.args.defaultBlockLabel = '';
  }
});
</script>

<template>
  <PlBlockPage
    title="Repertoire Diversity"
  >
    <template #append>
      <PlBtnGhost @click.stop="showSettings">
        Settings
        <template #append>
          <PlMaskIcon24 name="settings" />
        </template>
      </PlBtnGhost>
    </template>
    <PlAgDataTableV2 v-model="app.model.ui.tableState" :settings="tableSettings" show-export-button />
  </PlBlockPage>

  <SettingsModal v-model="settingsAreShown" />
</template>
