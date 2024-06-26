<script setup lang="ts">
import { IDataGroup } from "src/config/types";
import { useProject } from "src/stores/useProject";
import { Ref, onMounted, ref, watch } from "vue";
// import { useUnit } from "../../stores/useUnit";

const props = defineProps<{
    initialValues?: IDataGroup;
}>();
const emit = defineEmits<{
    (e: "onClose"): void;
}>();

const isSubmitting = ref(false);
const validForm = ref(false);
const form: Ref<{
    name: string;
}> = ref({ name: "", });

const vendor = useProject();

const onSubmit = () => {
    if (!validForm.value) return;

    if (!!props.initialValues) {
        vendor.putEditData(form.value, props.initialValues.uuid, {
            beforeSend: () => {
                isSubmitting.value = true;
            },
            success: () => {

                isSubmitting.value = false;
                vendor.getIndex(
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            },
            error: () => {

                isSubmitting.value = false;
                vendor.getIndex(
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            }
        });
    }
    else {
        vendor.postCreate(form.value, {
            beforeSend: () => {
                isSubmitting.value = true;
            },
            success: () => {

                isSubmitting.value = false;
                vendor.getIndex(
                    { page: 1, limit: 10 }
                );
                emit("onClose");
            },
            error: () => {

                isSubmitting.value = false;
                vendor.getIndex(
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
    }
});


</script>
<template>
    <v-form v-model="validForm" @submit.prevent="onSubmit">
        <v-text-field v-model="form.name" :readonly="isSubmitting" :rules="[required]" class="mb-2"
            label="Data Group Name" clearable></v-text-field>

        <v-btn :disabled="!validForm" :loading="isSubmitting" color="success" size="large" type="submit"
            variant="elevated" block>
            {{ !!initialValues ? "Edit" : "Create" }}
        </v-btn>
    </v-form>
</template>
