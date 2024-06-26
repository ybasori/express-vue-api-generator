import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import API from "src/config/api";
import { IDataStructure } from "src/config/types";
import { expandJSON } from "src/utils/helper";
import { Ref, ref } from "vue";

export const useDataStructure = defineStore("dataStructure", () => {
  const dataStructures: Ref<null | {
    count: number;
    rows: IDataStructure[];
  }> = ref(null);
  const dataStructuresLoading = ref(false);
  const dataStructuresError: Ref<null | AxiosError> = ref(null);

  async function getIndex(
    projectUuid: string,
    dataGroupUuid: string,
    query: {
      page: number;
      limit: number;
      sort?: { key: string; order: "asc" | "desc" };
    }
  ) {
    try {
      dataStructuresLoading.value = true;

      const queryString = expandJSON(query)
        .map((item) => (item.value ? `${item.label}=${item.value}` : null))
        .filter((item) => item !== null)
        .join("&");

      const response = await axios({
        url: `${API.LOCAL.API.V1.DATASTRUCTURE_INDEX.replace(
          ":projectUuid",
          projectUuid
        ).replace(":dataGroupUuid", dataGroupUuid)}?${queryString}`,
        method: "get",
        headers: {
          //   Authorization: `Bearer ${userStore.user?.token}`,
        },
      });

      dataStructuresLoading.value = false;
      dataStructures.value = response.data.data;
    } catch (err) {
      dataStructuresLoading.value = false;
      if (err instanceof AxiosError) {
        dataStructuresError.value = err;
      }
    }
  }

  async function postData(
    form: { name: string },
    projectUuid: string,
    dataGroupUuid: string,
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
        url: `${API.LOCAL.API.V1.DATASTRUCTURE_INDEX.replace(
          ":projectUuid",
          projectUuid
        ).replace(":dataGroupUuid", dataGroupUuid)}`,
        method: "post",
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

  async function deleteData(
    projectUuid: string,
    dataGroupUuid: string,
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
        url: `${API.LOCAL.API.V1.DATASTRUCTURE_DETAIL.replace(
          ":projectUuid",
          projectUuid
        )
          .replace(":dataGroupUuid", dataGroupUuid)
          .replace(":dataStructureUuid", uuid)}`,
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
    projectUuid: string,
    dataGroupUuid: string,
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
        url: `${API.LOCAL.API.V1.DATASTRUCTURE_DETAIL.replace(
          ":projectUuid",
          projectUuid
        )
          .replace(":dataGroupUuid", dataGroupUuid)
          .replace(":dataStructureUuid", uuid)}`,
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
    dataStructures,
    dataStructuresLoading,
    dataStructuresError,
    postData,
    deleteData,
    putEditData,
  };
});
