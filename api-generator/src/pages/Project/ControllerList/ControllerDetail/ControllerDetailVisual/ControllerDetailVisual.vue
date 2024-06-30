<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { Background } from '@vue-flow/background'
import SpecialNode from 'src/components/organisms/SpecialNode.vue';

const route = useRoute();
const nodes = ref<Node[]>([
    {
        id: '1',
        type: 'special-input',
        position: { x: 100, y: 200 },
        data: { label: 'Request' },
    },
    {
        id: '2',
        type: "special",
        position: { x: 300, y: 100 },
        data: { label: 'Params' },
    },
    {
        id: '3',
        type: "special",
        position: { x: 300, y: 200 },
        data: { label: 'Query' },
    },
    {
        id: '4',
        type: "special",
        position: { x: 300, y: 300 },
        data: {
            label: 'Body',
        },
    },
    {
        id: '5',
        type: 'special-input',
        position: { x: 100, y: 400 },
        data: { label: 'Response' },
    },
])

const edges = ref<Edge[]>([
    {
        id: 'e1->2',
        source: '1',
        target: '2',
    },
    {
        id: 'e1->3',
        source: '1',
        target: '3',
    },
    {
        id: 'e1->4',
        source: '1',
        target: '4',
    },
])
</script>

<template>
    <v-btn size="small"
        :to="`/project/${route.params.projectUuid}/controller/${route.params.controllerUuid}`">Back</v-btn>
    <div style="width: 100%; height: calc(100vh - 100px)">
        <VueFlow :nodes="nodes" :edges="edges">

            <template #node-special="props">
                <SpecialNode :data="props.data" />
            </template>
            <template #node-special-input="props">
                <SpecialNode :data="props.data" input />
            </template>
            <Background />
            <Controls />
        </VueFlow>
    </div>
</template>


<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';

@import '@vue-flow/controls/dist/style.css';
</style>