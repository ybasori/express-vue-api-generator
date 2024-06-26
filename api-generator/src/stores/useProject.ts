import axios, { AxiosError } from "axios";
import { defineStore } from "pinia";
import API from "src/config/api";
import { IProject } from "src/config/types";
import { expandJSON } from "src/utils/helper";
import { Ref, ref } from "vue";

export const useProject = defineStore("useProject", () => {
  const projects: Ref<null | {
    count: number;
    rows: IProject[];
  }> = ref(null);
  const projectsLoading = ref(false);
  const projectsError: Ref<null | AxiosError> = ref(null);

  async function getIndex(query: {
    page: number;
    limit: number;
    sort?: { key: string; order: "asc" | "desc" };
  }) {
    try {
      projectsLoading.value = true;

      const queryString = expandJSON(query)
        .map((item) => (item.value ? `${item.label}=${item.value}` : null))
        .filter((item) => item !== null)
        .join("&");

      const response = await axios({
        url: `${API.LOCAL.API.V1.PROJECT_INDEX}?${queryString}`,
        method: "get",
        headers: {
          //   Authorization: `Bearer ${userStore.user?.token}`,
        },
      });

      projectsLoading.value = false;
      projects.value = response.data.data;
    } catch (err) {
      projectsLoading.value = false;
      if (err instanceof AxiosError) {
        projectsError.value = err;
      }
    }
  }

  async function postCreate(
    form: { name: string },
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
        url: `${API.LOCAL.API.V1.PROJECT_INDEX}`,
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

  async function deleteProject(
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
        url: `${API.LOCAL.API.V1.PROJECT_DETAIL.replace(":projectUuid", uuid)}`,
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
        url: `${API.LOCAL.API.V1.PROJECT_DETAIL.replace(":projectUuid", uuid)}`,
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
    projects,
    projectsLoading,
    projectsError,
    postCreate,
    deleteProject,
    putEditData,
  };
});
