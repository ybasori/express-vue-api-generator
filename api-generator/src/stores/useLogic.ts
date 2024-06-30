import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import API from "src/config/api";
import { IDataGroup } from "src/config/types";
import { expandJSON } from "src/utils/helper";
import { Ref, ref } from "vue";

export const useLogic = defineStore("useLogic", () => {
  const logics: Ref<null | {
    count: number;
    rows: IDataGroup[];
  }> = ref(null);
  const logicsLoading = ref(false);
  const logicsError: Ref<null | AxiosError> = ref(null);

  async function getIndex(
    projectUuid: string,
    query: {
      page: number;
      limit: number;
      sort?: { key: string; order: "asc" | "desc" };
    }
  ) {
    try {
      logicsLoading.value = true;

      const queryString = expandJSON(query)
        .map((item) => (item.value ? `${item.label}=${item.value}` : null))
        .filter((item) => item !== null)
        .join("&");

      const response = await axios({
        url: `${API.LOCAL.API.V1.LOGIC_INDEX.replace(
          ":projectUuid",
          projectUuid
        )}?${queryString}`,
        method: "get",
        headers: {
          //   Authorization: `Bearer ${userStore.user?.token}`,
        },
      });

      logicsLoading.value = false;
      logics.value = response.data.data;
    } catch (err) {
      logicsLoading.value = false;
      if (err instanceof AxiosError) {
        logicsError.value = err;
      }
    }
  }

  async function postCreate(
    form: { name: string },
    projectUuid: string,
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
        url: `${API.LOCAL.API.V1.LOGIC_INDEX.replace(
          ":projectUuid",
          projectUuid
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

  async function deleteDataGroup(
    projectUuid: string,
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
        url: `${API.LOCAL.API.V1.LOGIC_DETAIL.replace(
          ":projectUuid",
          projectUuid
        ).replace(":logicUuid", uuid)}`,
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
        url: `${API.LOCAL.API.V1.LOGIC_DETAIL.replace(
          ":projectUuid",
          projectUuid
        ).replace(":logicUuid", uuid)}`,
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
    logics,
    logicsLoading,
    logicsError,
    postCreate,
    deleteDataGroup,
    putEditData,
  };
});
