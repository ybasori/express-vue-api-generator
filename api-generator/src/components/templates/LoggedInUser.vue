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
    },
    {
        title: "Data",
        value: "/data-group",
        icon: "mdi mdi-account-box",
    },
    {
        title: "About",
        value: "/about",
        icon: "mdi mdi-account-box",
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
                    <RouterLink
                        :class="'v-list-item v-list-item--link v-theme--light v-list-item--density-default v-list-item--one-line rounded-0 v-list-item--variant-text ' + ($route.fullPath === item.value ? 'v-list-item--active' : '')"
                        v-for="(item, i) in items" :key="i" :value="item" :to="item.value">
                        <span class="v-list-item__overlay"></span>
                        <span class="v-list-item__underlay"></span>
                        <div class="v-list-item__prepend">
                            <i :class="item.icon + ' v-icon v-theme--light v-icon--size-default'"></i>
                            <div class="v-list-item__spacer"></div>
                        </div>
                        <div class="v-list-item__content">{{ item.title }}</div>
                    </RouterLink>
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