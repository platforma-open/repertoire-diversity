import { model } from '@platforma-open/milaboratories.repertoire-diversity.model';
import { defineApp } from '@platforma-sdk/ui-vue';
import GraphPage from './pages/GraphPage.vue';
import MainPage from './pages/MainPage.vue';

export const sdkPlugin = defineApp(model, (app) => {
  return {
    progress: () => {
      return app.model.outputs.isRunning;
    },
    showErrorsNotification: true,
    routes: {
      '/': () => MainPage,
      '/graph': () => GraphPage
    }
  };
});

export const useApp = sdkPlugin.useApp;
