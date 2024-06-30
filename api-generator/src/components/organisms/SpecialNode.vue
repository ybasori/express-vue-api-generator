<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'


const props = defineProps<{
    data: {
        label: string;
    },
    input?: boolean;
    output?: boolean;
}>();
</script>

<template>
    <div class="box">
        <div>{{ props.data.label }}</div>

        <Handle v-if="!props.output" type="source" :position="Position.Right" />

        <Handle v-if="!props.input" type="target" :position="Position.Left" />
    </div>
</template>
<style scoped>
.box {
    border: .3px solid #000;
    border-radius: 4px;
    background-color: #fff;
    width: 150px;
    padding: 10px;
}

.box>div {
    text-align: center;
}

.box:hover {
    box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.08);
}
</style>