<script setup lang="ts">
import DataStructureAddEdit from "src/components/organisms/DataStructureAddEdit.vue";
import type { IDataStructure } from "src/config/types";
import { useDataStructure } from "src/stores/useDataStructure";
import { Ref, ref } from "vue";
import { useRoute } from "vue-router";
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
    { key: "type", title: "Type" },
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
const vendorStore = useDataStructure();

const dialog = ref(false);
const dialogEdit = ref(false);
const itemEdit: Ref<undefined | IDataStructure> = ref(undefined);
const dialogDelete = ref(false);
const itemDelete: Ref<null | IDataStructure> = ref(null);
const isSubmittingDelete = ref(false);
const route = useRoute()


const openDialog = () => {
    dialog.value = true;
};
const openDialogEdit = (item: IDataStructure) => {
    dialogEdit.value = true;
    itemEdit.value = item;
};
const openDialogDelete = (item: IDataStructure) => {
    console.log(item)
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
    vendorStore.deleteData(`${route.params.uuid}`, itemDelete.value?.uuid ?? "", {
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
    vendorStore.getIndex(`${route.params.uuid}`,
        { page, limit, sort: sortBy }
    );
};
</script>
<template>

    <v-card flat color="#dddddd">
        <template v-slot:title>
            <span>List Data Structure</span>
        </template>
        <template v-slot:append>
            <v-btn class="text-none" color="primary" text="NEW DATA STRUCTURE" variant="text" slim
                @click="openDialog()"></v-btn>
        </template>
        <v-data-table-server :headers="headers" :items="vendorStore.dataStructures?.rows ?? []"
            @update:options="loadItems" v-model:items-per-page="itemsPerPage"
            :items-length="vendorStore.dataStructures?.count ?? 0" :loading="vendorStore.dataStructuresLoading">

            <template v-slot:item.action="{ item }: { item: IDataStructure }">
                <v-btn color="primary" text="Edit" slim @click="openDialogEdit(item)"></v-btn>
                <v-btn color="red" text="Delete" slim @click="openDialogDelete(item)"></v-btn>
            </template>

            <template v-slot:item.no="{ index }: { index: number }">
                {{ index + 1 }}.
            </template>

        </v-data-table-server>
    </v-card>


    <v-dialog v-model="dialog" max-width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">New Data Structure</div>

                <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
            </v-card-title>
            <v-divider class="mb-4"></v-divider>

            <v-card-text>
                <DataStructureAddEdit @onClose="dialog = false" :dataGroupUuid="`${route.params.uuid}`">
                </DataStructureAddEdit>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" max-width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">Edit Data Structure</div>

                <v-btn icon="mdi-close" variant="text" @click="closeDialogEdit()"></v-btn>
            </v-card-title>
            <v-divider class="mb-4"></v-divider>

            <v-card-text>
                <DataStructureAddEdit :initialValues="itemEdit" @onClose="closeDialogEdit()"
                    :dataGroupUuid="`${route.params.uuid}`"></DataStructureAddEdit>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">Delete Data Structure</div>

                <v-btn icon="mdi-close" variant="text" @click="closeDialogDelete()"
                    :disabled="isSubmittingDelete"></v-btn>
            </v-card-title>
            <v-divider class="mb-4"></v-divider>
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