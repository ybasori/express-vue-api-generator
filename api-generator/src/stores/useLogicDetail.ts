import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import API from "src/config/api";
import { IDataGroup } from "src/config/types";
import { expandJSON } from "src/utils/helper";
import { Ref, ref } from "vue";

export const useLogicDetail = defineStore("useLogicDetail", () => {
  const logicDetails: Ref<null | {
    count: number;
    rows: IDataGroup[];
  }> = ref(null);
  const logicDetailsLoading = ref(false);
  const logicDetailsError: Ref<null | AxiosError> = ref(null);

  async function getIndex(
    projectUuid: string,
    logicUuid: string,
    query: {
      page: number;
      limit: number;
      sort?: { key: string; order: "asc" | "desc" };
    }
  ) {
    try {
      logicDetailsLoading.value = true;

      const queryString = expandJSON(query)
        .map((item) => (item.value ? `${item.label}=${item.value}` : null))
        .filter((item) => item !== null)
        .join("&");

      const response = await axios({
        url: `${API.LOCAL.API.V1.LOGIC_DETAIL_INDEX.replace(
          ":projectUuid",
          projectUuid
        ).replace(":logicUuid", logicUuid)}?${queryString}`,
        method: "get",
        headers: {
          //   Authorization: `Bearer ${userStore.user?.token}`,
        },
      });

      logicDetailsLoading.value = false;
      logicDetails.value = response.data.data;
    } catch (err) {
      logicDetailsLoading.value = false;
      if (err instanceof AxiosError) {
        logicDetailsError.value = err;
      }
    }
  }

  async function postCreate(
    form: { name: string },
    projectUuid: string,
    logicUuid: string,
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
        url: `${API.LOCAL.API.V1.LOGIC_DETAIL_INDEX.replace(
          ":projectUuid",
          projectUuid
        ).replace(":logicUuid", logicUuid)}`,
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
    logicUuid: string,
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
        url: `${API.LOCAL.API.V1.LOGIC_DETAIL_DETAIL.replace(
          ":projectUuid",
          projectUuid
        )
          .replace(":logicUuid", logicUuid)
          .replace(":logicDetailUuid", uuid)}`,
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
    logicUuid: string,
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
        url: `${API.LOCAL.API.V1.LOGIC_DETAIL_DETAIL.replace(
          ":projectUuid",
          projectUuid
        )
          .replace(":logicUuid", logicUuid)
          .replace(":logicDetailUuid", uuid)}`,
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
    logicDetails,
    logicDetailsLoading,
    logicDetailsError,
    postCreate,
    deleteDataGroup,
    putEditData,
  };
});
