<script setup lang="ts">
import DataListAddEdit from "src/components/organisms/DataListAddEdit.vue";
import { IDataStructure } from "src/config/types";
import { useDataList } from 'src/stores/useDataList';
import { Ref, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute()
const itemsPerPage = ref(10);
const currentPage = ref(1);
const sortPage: Ref<{
    key: string;
    order: "asc" | "desc";
} | undefined> = ref(undefined);

const vendorStore = useDataList();

const loadItems = ({
    page,
    itemsPerPage: limit,
    sortBy,
}: {
    page: number;
    itemsPerPage: number;
    sortBy?: { key: string; order: "asc" | "desc" };
}) => {
    currentPage.value = page;
    sortPage.value = sortBy;
    itemsPerPage.value = limit;
    vendorStore.getIndexData(`${route.params.projectUuid}`, `${route.params.dataGroupUuid}`,
        { page, limit, sort: sortBy }
    );
};


const dialog = ref(false);
const dialogEdit = ref(false);
const itemEdit: Ref<undefined | { [key: string]: unknown }> = ref(undefined);
const dialogDelete = ref(false);
const isSubmittingDelete = ref(false);
const itemDelete: Ref<null | { uuid: string }> = ref(null);

const openDialog = () => {
    dialog.value = true;
};

const openDialogEdit = (item: { [key: string]: unknown }) => {
    dialogEdit.value = true;
    itemEdit.value = item;
};
const closeDialogEdit = () => {
    dialogEdit.value = false;
    itemEdit.value = undefined;
};
const openDialogDelete = (item: { uuid: string }) => {
    dialogDelete.value = true;
    itemDelete.value = item;
};

const closeDialogDelete = () => {
    dialogDelete.value = false;
    itemDelete.value = null;
};

const onDelete = () => {
    vendorStore.deleteData(`${route.params.projectUuid}`, `${route.params.dataGroupUuid}`, itemDelete.value?.uuid ?? "", {
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

onMounted(() => {
    loadItems({ page: 1, itemsPerPage: 10 })
})
</script>
<template>
    <v-card flat color="#dddddd">
        <template v-slot:title>
            <span>Data List</span>
        </template>
        <template v-slot:append>
            <v-btn class="text-none" color="primary" text="NEW DATA" variant="text" slim @click="openDialog()"></v-btn>
        </template>
    </v-card>
    <v-data-table-server :headers="[
        { align: 'start', key: 'no', sortable: false, title: 'No', },
        ...vendorStore.dataLists?.dataGroup.dataStructure.map((item: IDataStructure) => ({ key: item.name, title: item.name })) ?? [],
        { key: 'createdAt', title: 'Created At' },
        { key: 'updatedAt', title: 'Updated At' },
        { key: 'action', title: 'Action', sortable: false, },]" :items="vendorStore.dataLists?.dataRow.rows"
        @update:options="loadItems" v-model:items-per-page="itemsPerPage"
        :items-length="vendorStore.dataLists?.dataRow.count ?? 0" :loading="vendorStore.dataListsLoading">

        <template v-slot:item.no="{ index }: { index: number }">
            {{ index + 1 }}.
        </template>

        <template v-slot:item.action="{ item }">
            <v-btn size="small" color="primary" text="Edit" slim @click="openDialogEdit(item)"></v-btn>
            <v-btn size="small" color="red" text="Delete" slim @click="openDialogDelete(item)"></v-btn>
        </template>

    </v-data-table-server>
    <v-dialog v-model="dialog" max-width="800">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">New Data</div>

                <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
            </v-card-title>
            <v-divider class="mb-4"></v-divider>
            <v-card-text>
                <DataListAddEdit :projectUuid="`${route.params.projectUuid}`"
                    :dataGroupUuid="`${route.params.dataGroupUuid}`"
                    :dataStructure="vendorStore.dataLists?.dataGroup.dataStructure ?? []" @onClose="dialog = false">
                </DataListAddEdit>
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
                <DataListAddEdit :projectUuid="`${route.params.projectUuid}`"
                    :dataGroupUuid="`${route.params.dataGroupUuid}`"
                    :dataStructure="vendorStore.dataLists?.dataGroup.dataStructure ?? []" :initialValues="itemEdit"
                    @onClose="closeDialogEdit()" :isEdit="true">
                </DataListAddEdit>
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