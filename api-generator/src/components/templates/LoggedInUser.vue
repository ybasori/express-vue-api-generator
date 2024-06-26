<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(true);
const group = ref(null);
const items = [
    {
        title: "Dashboard",
        value: "/",
        icon: "mdi mdi-view-dashboard",
        exact: true
    },
    {
        title: "Project",
        value: "/project",
        icon: "mdi mdi-account-box",
        exact: false
    },
    {
        title: "About",
        value: "/about",
        icon: "mdi mdi-account-box",
        exact: false
    },
];

watch(group, () => {
    drawer.value = false;
});
</script>
<template>

    <v-card>
        <v-layout>
            <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" permanent>
                <v-list>
                    <v-list-item v-for="(item, i) in items" :key="i" :prepend-icon="item.icon" :title="item.title"
                        :to="item.value" :exact="item.exact"></v-list-item>
                </v-list>
                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn color="primary" block>
                            Logout
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>

            <v-main style="height: 100vh">
                <v-app-bar prominent>
                    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

                    <v-toolbar-title>{{ $route.fullPath }}</v-toolbar-title>
                    <template v-if="$vuetify.display.mdAndUp">
                        <!-- <slot name="additional"></slot> -->
                    </template>
                </v-app-bar>
                <v-card-text>
                    <router-view></router-view>
                </v-card-text>
            </v-main>
        </v-layout>
    </v-card>
</template>