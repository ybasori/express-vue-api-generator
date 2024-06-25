<script setup lang="ts">
import { IDataStructure } from "src/config/types";
import { useDataStructure } from "src/stores/useDataStructure";
import { Ref, onMounted, ref, watch } from "vue";
// import { useUnit } from "../../stores/useUnit";

const props = defineProps<{
    initialValues?: IDataStructure;
    dataGroupUuid: string;
}>();
const emit = defineEmits<{
    (e: "onClose"): void;
}>();

const isSubmitting = ref(false);
const validForm = ref(false);
const form: Ref<{
    name: string;
    type: null | string;
}> = ref({ name: "", type: null, });

const vendor = useDataStructure();

const onSubmit = () => {
    if (!validForm.value) return;

    if (!!props.initialValues) {
        vendor.putEditData(form.value, props.dataGroupUuid, props.initialValues.uuid, {
            beforeSend: () => {
                isSubmitting.value = true;
            },
            success: () => {

                isSubmitting.value = false;
                vendor.getIndex(props.dataGroupUuid,
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            },
            error: () => {

                isSubmitting.value = false;
                vendor.getIndex(props.dataGroupUuid,
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            }
        });
    }
    else {
        vendor.postData(form.value, props.dataGroupUuid, {
            beforeSend: () => {
                isSubmitting.value = true;
            },
            success: () => {

                isSubmitting.value = false;
                vendor.getIndex(props.dataGroupUuid,
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            },
            error: () => {

                isSubmitting.value = false;
                vendor.getIndex(props.dataGroupUuid,
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            }
        });
    }
};

const required = (v: string) => {
    return !!v || "Field is required";
};

onMounted(() => {
    if (props.initialValues) {
        form.value.name = props.initialValues.name;
        form.value.type = props.initialValues.type;
    }
});


</script>
<template>
    <v-form v-model="validForm" @submit.prevent="onSubmit">
        <v-text-field v-model="form.name" :readonly="isSubmitting" :rules="[required]" class="mb-2"
            label="Data Structure Name" clearable></v-text-field>
        <v-select v-model="form.type" label="Data Type" :items="['text', 'number']"></v-select>

        <v-btn :disabled="!validForm" :loading="isSubmitting" color="success" size="large" type="submit"
            variant="elevated" block>
            {{ !!initialValues ? "Edit" : "Create" }}
        </v-btn>
    </v-form>
</template>
