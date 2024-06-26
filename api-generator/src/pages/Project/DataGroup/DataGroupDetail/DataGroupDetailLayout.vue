<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>
<template>

    <v-btn size="small" :to="`/project/${route.params.projectUuid}/model`">Back</v-btn>
    <v-tabs color="deep-purple-accent-4">
        <v-tab
            :to="`/project/${route.params.projectUuid}/model/${route.params.dataGroupUuid}/structure`">Structure</v-tab>
        <v-tab :to="`/project/${route.params.projectUuid}/model/${route.params.dataGroupUuid}/data`">Data</v-tab>
    </v-tabs>
    <router-view></router-view>
</template>