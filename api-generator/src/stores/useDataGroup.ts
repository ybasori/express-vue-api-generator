import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import API from "src/config/api";
import { IDataGroup } from "src/config/types";
import { expandJSON } from "src/utils/helper";
import { Ref, ref } from "vue";

export const useDataGroup = defineStore("dataGroup", () => {
  const dataGroups: Ref<null | {
    count: number;
    rows: IDataGroup[];
  }> = ref(null);
  const dataGroupsLoading = ref(false);
  const dataGroupsError: Ref<null | AxiosError> = ref(null);

  const dataGroupCreate = ref(null);
  const dataGroupCreateLoading = ref(false);
  const dataGroupCreateError: Ref<null | AxiosError> = ref(null);

  async function getIndex(query: {
    page: number;
    limit: number;
    sort?: { key: string; order: "asc" | "desc" };
  }) {
    try {
      dataGroupsLoading.value = true;

      const queryString = expandJSON(query)
        .map((item) => (item.value ? `${item.label}=${item.value}` : null))
        .filter((item) => item !== null)
        .join("&");

      const response = await axios({
        url: `${API.LOCAL.API.V1.DATAGROUP.INDEX}?${queryString}`,
        method: "get",
        headers: {
          //   Authorization: `Bearer ${userStore.user?.token}`,
        },
      });

      dataGroupsLoading.value = false;
      dataGroups.value = response.data.data;
    } catch (err) {
      dataGroupsLoading.value = false;
      if (err instanceof AxiosError) {
        dataGroupsError.value = err;
      }
    }
  }

  async function postCreate(form: { name: string }) {
    try {
      dataGroupCreateLoading.value = true;

      const response = await axios({
        url: `${API.LOCAL.API.V1.DATAGROUP.INDEX}`,
        method: "post",
        headers: {
          //   Authorization: `Bearer ${userStore.user?.token}`,
        },
        data: form,
      });

      dataGroupCreateLoading.value = false;
      dataGroupCreate.value = response.data.data;
    } catch (err) {
      dataGroupCreateLoading.value = false;
      if (err instanceof AxiosError) {
        dataGroupCreateError.value = err;
      }
    }
  }

  async function resetPostCreate() {
    dataGroupCreate.value = null;
  }

  async function deleteDataGroup(
    uuid: string,
    {
      beforeSend,
      success,
      error,
    }: {
      beforeSend: () => void;
      success: (data: unknown) => void;
      error: (err: unknown) => void;
    }
  ) {
    try {
      beforeSend();
      const response = await axios({
        url: `${API.LOCAL.API.V1.DATAGROUP.SHOW.replace(":uuid", uuid)}`,
        method: "delete",
        headers: {
          //   Authorization: `Bearer ${userStore.user?.token}`,
        },
      });
      success(response.data.data);
    } catch (err) {
      error(err);
    }
  }

  async function putEditData(
    form: { name: string },
    uuid: string,
    {
      beforeSend,
      success,
      error,
    }: {
      beforeSend: () => void;
      success: (data: unknown) => void;
      error: (err: unknown) => void;
    }
  ) {
    try {
      beforeSend();

      const response = await axios({
        url: `${API.LOCAL.API.V1.DATAGROUP.SHOW.replace(":uuid", uuid)}`,
        method: "put",
        headers: {
          //   Authorization: `Bearer ${userStore.user?.token}`,
        },
        data: form,
      });

      success(response.data.data);
    } catch (err) {
      error(err);
    }
  }

  return {
    getIndex,
    dataGroups,
    dataGroupsLoading,
    dataGroupsError,
    postCreate,
    resetPostCreate,
    dataGroupCreate,
    dataGroupCreateLoading,
    dataGroupCreateError,
    deleteDataGroup,
    putEditData,
  };
});
