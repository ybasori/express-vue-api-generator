<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IDataStructure } from "src/config/types";
import { useDataList } from "src/stores/useDataList";

const props = defineProps<{
    dataStructure: IDataStructure[];
    projectUuid: string;
    dataGroupUuid: string;
    initialValues?: { [key: string]: unknown };
    isEdit?: boolean;
}>();
const emit = defineEmits<{
    (e: "onClose"): void;
}>();

const isSubmitting = ref(false);
const validForm = ref(false);
const form = ref<{
    [key: string]: unknown
}>({});
const vendor = useDataList();



const onSubmit = () => {
    if (props.isEdit) {
        vendor.putEditData(form.value, props.projectUuid, props.dataGroupUuid, `${props.initialValues?.['uuid']}`, {
            beforeSend: () => {
                isSubmitting.value = true;
            },
            success: () => {

                isSubmitting.value = false;
                vendor.getIndexData(props.projectUuid, props.dataGroupUuid,
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            },
            error: () => {

                isSubmitting.value = false;
                vendor.getIndexData(props.projectUuid, props.dataGroupUuid,
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            }
        });
    }
    else {
        vendor.postCreateData(form.value, props.projectUuid, props.dataGroupUuid, {
            beforeSend: () => {
                isSubmitting.value = true;
            },
            success: () => {
                isSubmitting.value = false;
                vendor.getIndexData(props.projectUuid, props.dataGroupUuid, {
                    page: 1, limit: 10
                })
                emit("onClose");

            },
            error: () => {
                isSubmitting.value = false;

            }
        });
    }
}

onMounted(() => {
    if (!!props.initialValues) {
        [...props.dataStructure].forEach((item, i) => {
            form.value[item.name] = props.initialValues?.[item.name];
        })
    }
});


const required = (v: string) => {
    return !!v || "Field is required";
};

</script>
<template>
    <v-form v-model="validForm" @submit.prevent="onSubmit">
        <template v-for="(item, i) in props.dataStructure" :key="i">

            <v-text-field v-if="item.type === 'text'" v-model="form[item.name]" :readonly="false" class="mb-2"
                :label="item.name" clearable :rules="[required]"></v-text-field>
            <v-number-input v-if="item.type === 'number'" control-variant="default" :label="item.name" clearable
                :rules="[required]" :readonly="false" v-model="form[item.name]"></v-number-input>
        </template>

        <v-btn :disabled="!validForm" :loading="isSubmitting" color="success" size="large" type="submit"
            variant="elevated" block>
            {{ props.isEdit ? "Edit" : "Create" }}
        </v-btn>
    </v-form>
</template>
