<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
const router = useRouter();

onMounted(() => {
    router.push(`/project/${route.params.projectUuid}/model/${route.params.dataGroupUuid}/structure`);
})

</script>
<template>
    Detail
</template>