<script setup lang="ts">
import { IDataGroup } from "src/config/types";
import { useDataGroup } from "src/stores/useDataGroup";
import { Ref, onMounted, ref, watch } from "vue";
// import { useUnit } from "../../stores/useUnit";

const props = defineProps<{
    initialValues?: IDataGroup;
    projectUuid: string;
}>();
const emit = defineEmits<{
    (e: "onClose"): void;
}>();

const isSubmitting = ref(false);
const validForm = ref(false);
const form: Ref<{
    name: string;
}> = ref({ name: "", });

const vendor = useDataGroup();

const onSubmit = () => {
    if (!validForm.value) return;

    if (!!props.initialValues) {
        vendor.putEditData(form.value, props.projectUuid, props.initialValues.uuid, {
            beforeSend: () => {
                isSubmitting.value = true;
            },
            success: () => {

                isSubmitting.value = false;
                vendor.getIndex(props.projectUuid,
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            },
            error: () => {

                isSubmitting.value = false;
                vendor.getIndex(props.projectUuid,
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            }
        });
    }
    else {
        vendor.postCreate(form.value, props.projectUuid);
    }
};

const required = (v: string) => {
    return !!v || "Field is required";
};

watch(
    () => vendor.dataGroupCreate,
    () => {
        if (vendor.dataGroupCreate !== null) {
            vendor.resetPostCreate();
            vendor.getIndex(props.projectUuid,
                { page: 1, limit: 10 }
            );
            emit("onClose");
        }
    }
);

onMounted(() => {
    if (props.initialValues) {
        form.value.name = props.initialValues.name;
    }
});


</script>
<template>
    <v-form v-model="validForm" @submit.prevent="onSubmit">
        <v-text-field v-model="form.name" :readonly="vendor.dataGroupCreateLoading" :rules="[required]" class="mb-2"
            label="Data Group Name" clearable></v-text-field>

        <v-btn :disabled="!validForm" :loading="vendor.dataGroupCreateLoading || isSubmitting" color="success"
            size="large" type="submit" variant="elevated" block>
            {{ !!initialValues ? "Edit" : "Create" }}
        </v-btn>
    </v-form>
</template>
