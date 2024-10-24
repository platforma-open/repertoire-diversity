<script setup lang="ts">
import { GraphMaker, GraphMakerSettings } from "@milaboratories/graph-maker";
import '@milaboratories/graph-maker/dist/style.css';
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
    <GraphMaker :pFrame="app.model.outputs.pf" :modelValue="settings" />
</template>