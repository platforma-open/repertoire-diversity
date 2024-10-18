<script setup lang="ts">
import { GraphMaker } from "@milaboratories/graph-maker";
import { GraphMakerSettings } from "@milaboratories/graph-maker/dist/GraphMaker/types";
import "@milaboratories/graph-maker/dist/style.css";
import { model } from "@platforma-open/milaboratories.repertoire-diversity.model";
import { ref } from "vue";
import { useApp } from "../app";

const app = useApp();

const settings = ref({
    title: "Diversity Analysis",
    chartType: "discrete",
    template: "box"
} satisfies GraphMakerSettings);
</script>

<template>
    <GraphMaker v-if="app.model.outputs.pf" :p-frame-handle="app.model.outputs.pf" :p-frame-driver="model.pFrameDriver"
        :model-value="settings" />
</template>