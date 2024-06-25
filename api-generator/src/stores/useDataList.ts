import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import API from "src/config/api";
import { IDataStructure, IDataRowWithListStructure } from "src/config/types";
import { expandJSON } from "src/utils/helper";
import { Ref, ref } from "vue";

export const useDataList = defineStore("dataList", () => {
  const dataLists: Ref<null | {
    dataGroup: {
      name: string;
      dataStructure: IDataStructure[];
    };
    dataRow: {
      count: number;
      rows: { [key: string]: unknown }[];
    };
  }> = ref(null);
  const dataListsLoading = ref(false);
  const dataListsError: Ref<null | AxiosError> = ref(null);

  async function getIndexData(
    dataGroupUuid: string,
    query: {
      page: number;
      limit: number;
      sort?: { key: string; order: "asc" | "desc" };
    }
  ) {
    try {
      dataListsLoading.value = true;

      const queryString = expandJSON(query)
        .map((item) => (item.value ? `${item.label}=${item.value}` : null))
        .filter((item) => item !== null)
        .join("&");

      const response = await axios({
        url: `${API.LOCAL.API.V1.DATAGROUP.LIST.INDEX.replace(
          ":dataGroupUuid",
          dataGroupUuid
        )}?${queryString}`,
        method: "get",
        headers: {
          //   Authorization: `Bearer ${userStore.user?.token}`,
        },
      });

      dataListsLoading.value = false;
      dataLists.value = response.data.data;
    } catch (err) {
      dataListsLoading.value = false;
      if (err instanceof AxiosError) {
        dataListsError.value = err;
      }
    }
  }

  async function postCreateData(
    form: { [key: string]: unknown },
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
        url: `${API.LOCAL.API.V1.DATAGROUP.LIST.INDEX.replace(
          ":dataGroupUuid",
          dataGroupUuid
        )}`,
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
        url: `${API.LOCAL.API.V1.DATAGROUP.LIST.SHOW.replace(
          ":dataGroupUuid",
          dataGroupUuid
        ).replace(":dataListUuid", uuid)}`,
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
    form: { [key: string]: unknown },
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
        url: `${API.LOCAL.API.V1.DATAGROUP.LIST.SHOW.replace(
          ":dataGroupUuid",
          dataGroupUuid
        ).replace(":dataListUuid", uuid)}`,
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
    getIndexData,
    dataLists,
    dataListsLoading,
    dataListsError,
    postCreateData,
    deleteData,
    putEditData,
  };
});
