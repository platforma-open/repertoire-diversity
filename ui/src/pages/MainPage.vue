<script setup lang="ts">
import { PlAgDataTableV2, PlBlockPage, PlBtnGhost, PlMaskIcon24, usePlDataTableSettingsV2 } from '@platforma-sdk/ui-vue';
import { ref } from 'vue';
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

</script>

<template>
  <PlBlockPage
    v-model:subtitle="app.model.args.customBlockLabel"
    :subtitle-placeholder="app.model.args.defaultBlockLabel"
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
