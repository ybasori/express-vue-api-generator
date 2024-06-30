import { createWebHistory, createRouter } from "vue-router";
import HomeView from "src/pages/Home.vue";
import Login from "src/pages/Login.vue";
import About from "./pages/About.vue";
import DataGroup from "./pages/Project/DataGroup/DataGroup.vue";
import DataGroupDetail from "./pages/Project/DataGroup/DataGroupDetail/DataGroupDetail.vue";
import DataGroupDetailLayout from "./pages/Project/DataGroup/DataGroupDetail/DataGroupDetailLayout.vue";
import LoggedInUser from "./components/templates/LoggedInUser.vue";
import DataStructure from "./pages/Project/DataGroup/DataStructure/DataStructure.vue";
import DataList from "./pages/Project/DataGroup/DataList/DataList.vue";
import Project from "./pages/Project/Project.vue";
import ProjectDetailLayout from "./pages/Project/ProjectDetail/ProjectDetailLayout.vue";
import ProjectDetail from "./pages/Project/ProjectDetail/ProjectDetail.vue";
import Error404 from "./pages/Error/Error404.vue";
import ControllerList from "./pages/Project/ControllerList/ControllerList.vue";
import ControllerDetail from "./pages/Project/ControllerList/ControllerDetail/ControllerDetail.vue";
import ControllerDetailVisual from "./pages/Project/ControllerList/ControllerDetail/ControllerDetailVisual/ControllerDetailVisual.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "",
      path: "/",
      component: LoggedInUser,
      children: [
        { name: "Home", path: "", component: HomeView },
        {
          name: "Project",
          path: "project",
          children: [
            {
              name: "Project",
              path: "",
              component: Project,
            },
            {
              name: "Project Detail",
              path: ":projectUuid",
              component: ProjectDetailLayout,
              children: [
                {
                  name: "Project Detail",
                  path: "",
                  component: ProjectDetail,
                },
                {
                  name: "Model",
                  path: "model",
                  children: [
                    {
                      name: "Model Index",
                      path: "",
                      component: DataGroup,
                    },
                    {
                      name: "Model Detail",
                      path: ":dataGroupUuid",
                      component: DataGroupDetailLayout,
                      children: [
                        {
                          name: "Model Detail",
                          path: "",
                          component: DataGroupDetail,
                        },
                        {
                          name: "Model Structure",
                          path: "structure",
                          component: DataStructure,
                        },
                        {
                          name: "Data",
                          path: "data",
                          component: DataList,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Controller",
                  path: "controller",
                  children: [
                    {
                      name: "Controller Index",
                      path: "",
                      component: ControllerList,
                    },
                    {
                      name: "Controller Detail",
                      path: ":controllerUuid",
                      children: [
                        {
                          name: "Controller Detail Index",
                          path: "",
                          component: ControllerDetail,
                        },
                        {
                          name: "Controller Detail Visual",
                          path: "visual",
                          children: [
                            {
                              name: "Controller Detail",
                              path: ":controllerDetailUuid",
                              component: ControllerDetailVisual,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        { name: "About", path: "about", component: About },
      ],
    },
    { name: "Login", path: "/login", component: Login },
    { name: "404", path: "/:pathMatch(.*)*", component: Error404 },
  ],
});

// router.beforeEach((to, _from, next) => {
//   const isProtected =
//     routes.findIndex((item) => item.name === to.name && item.protected) >= 0;

//   const userStore = useUserLoggedIn();

//   if (isProtected && userStore.user !== null) next();
//   else if (to.name === "Login" && userStore.user !== null)
//     next({ name: "Home" });
//   else if (!isProtected) next();
//   else next({ name: "Login" });
// });

export default router;
