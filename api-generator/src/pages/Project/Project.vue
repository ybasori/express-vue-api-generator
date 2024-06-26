<script setup lang="ts">
import ProjectAddEdit from "src/components/organisms/ProjectAddEdit.vue";
import ProjectDelete from "src/components/organisms/ProjectDelete.vue";
import { IProject } from "src/config/types";
import { useProject } from "src/stores/useProject";
import { Ref, ref } from "vue";
import type { VDataTable } from "vuetify/components";

type ReadonlyHeaders = VDataTable["$props"]["headers"];
const headers: ReadonlyHeaders = [
    {
        align: "start",
        key: "no",
        sortable: false,
        title: "No",
    },
    { key: "name", title: "Name" },
    { key: "createdAt", title: "Created At" },
    { key: "updatedAt", title: "Updated At" },
    {
        key: "action", title: "Action",
        sortable: false,
    },
];


const itemsPerPage = ref(10);
const currentPage = ref(1);
const sortPage: Ref<{
    key: string;
    order: "asc" | "desc";
}> = ref({
    key: "createdAt",
    order: "asc"
});
const vendorStore = useProject();

const dialog = ref(false);
const dialogEdit = ref(false);
const itemEdit: Ref<undefined | IProject> = ref(undefined);
const dialogDelete = ref(false);
const itemDelete: Ref<null | IProject> = ref(null);
const isSubmittingDelete = ref(false);


const openDialog = () => {
    dialog.value = true;
};
const openDialogEdit = (item: IProject) => {
    dialogEdit.value = true;
    itemEdit.value = item;
};
const openDialogDelete = (item: IProject) => {
    dialogDelete.value = true;
    itemDelete.value = item;
};
const closeDialogEdit = () => {
    dialogEdit.value = false;
    itemEdit.value = undefined;
};
const closeDialogDelete = () => {
    dialogDelete.value = false;
    itemDelete.value = null;
};

const onDelete = () => {
    vendorStore.deleteProject(itemDelete.value?.uuid ?? "", {
        beforeSend: () => {
            isSubmittingDelete.value = true;
        },
        success: () => {
            isSubmittingDelete.value = false;
            closeDialogDelete();
            loadItems({
                page: currentPage.value,
                itemsPerPage: itemsPerPage.value,
                sortBy: sortPage.value
            })
        },
        error: () => {
            isSubmittingDelete.value = false;
            closeDialogDelete();
        }
    })
}

const loadItems = ({
    page,
    itemsPerPage: limit,
    sortBy,
}: {
    page: number;
    itemsPerPage: number;
    sortBy: { key: string; order: "asc" | "desc" };
}) => {
    currentPage.value = page;
    sortPage.value = sortBy;
    itemsPerPage.value = limit;
    vendorStore.getIndex(
        { page, limit, sort: sortBy }
    );
};
</script>
<template>

    <v-card flat color="#dddddd">
        <template v-slot:title>
            <span>List Project</span>
        </template>
        <template v-slot:append>
            <v-btn class="text-none" color="primary" text="NEW PROJECT" variant="text" slim
                @click="openDialog()"></v-btn>
        </template>
        <v-data-table-server :headers="headers" :items="vendorStore.projects?.rows ?? []" @update:options="loadItems"
            v-model:items-per-page="itemsPerPage" :items-length="vendorStore.projects?.count ?? 0"
            :loading="vendorStore.projectsLoading">

            <template v-slot:item.action="{ item }: { item: IProject }">
                <v-btn size="small" text="Detail" slim :to="`/project/${item.uuid}`"></v-btn>
                <v-btn size="small" color="primary" text="Edit" slim @click="openDialogEdit(item)"></v-btn>
                <v-btn size="small" color="red" text="Delete" slim @click="openDialogDelete(item)"></v-btn>
            </template>

            <template v-slot:item.no="{ index }: { index: number }">
                {{ index + 1 }}.
            </template>

        </v-data-table-server>
    </v-card>


    <v-dialog v-model="dialog" max-width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">New Data Group</div>

                <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
            </v-card-title>
            <v-divider class="mb-4"></v-divider>

            <v-card-text>
                <ProjectAddEdit @onClose="dialog = false"></ProjectAddEdit>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" max-width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">Edit Data Group</div>

                <v-btn icon="mdi-close" variant="text" @click="closeDialogEdit()"></v-btn>
            </v-card-title>
            <v-divider class="mb-4"></v-divider>

            <v-card-text>
                <ProjectAddEdit :initialValues="itemEdit" @onClose="closeDialogEdit()"></ProjectAddEdit>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">Delete Data Group</div>

                <v-btn icon="mdi-close" variant="text" @click="closeDialogDelete()"
                    :disabled="isSubmittingDelete"></v-btn>
            </v-card-title>
            <v-divider class="mb-4"></v-divider>
            <ProjectDelete></ProjectDelete>
            <template v-slot:actions>
                <v-spacer></v-spacer>

                <v-btn @click="closeDialogDelete()" :disabled="isSubmittingDelete">
                    Disagree
                </v-btn>

                <v-btn @click="onDelete()" :disabled="isSubmittingDelete">
                    Agree
                </v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>