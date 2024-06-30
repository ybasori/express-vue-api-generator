<script setup lang="ts">
import { useRoute } from "vue-router";


const route = useRoute();


</script>
<template>
    <template v-if="!!!route.params.dataGroupUuid && !!!route.params.controllerUuid">
        <v-btn size="small" :to="`/project`">Back</v-btn>
        <v-tabs color="deep-purple-accent-4">
            <v-tab :to="`/project/${route.params.projectUuid}/route`">Route</v-tab>
            <v-tab :to="`/project/${route.params.projectUuid}/controller`">Controller</v-tab>
            <v-tab :to="`/project/${route.params.projectUuid}/model`">Model</v-tab>
        </v-tabs>
    </template>
    <router-view></router-view>
</template>