import { createWebHistory, createRouter } from "vue-router";
import HomeView from "src/pages/Home.vue";
import Login from "src/pages/Login.vue";
import About from "./pages/About.vue";
import DataGroup from "./pages/DataGroup/DataGroup.vue";
import LoggedInUser from "./components/templates/LoggedInUser.vue";
import DataStructure from "./pages/DataGroup/DataStructure/DataStructure.vue";
import DataList from "./pages/DataGroup/DataList/DataList.vue";

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
          name: "Data Group",
          path: "data-group",
          children: [
            {
              name: "Data Group Index",
              path: "",
              component: DataGroup,
            },
            {
              name: "Data Group Detail",
              path: ":uuid",
              children: [
                {
                  name: "Data Group Structure",
                  path: "structure",
                  component: DataStructure,
                },
                {
                  name: "Data Group List",
                  path: "list",
                  component: DataList,
                },
              ],
            },
          ],
        },
        { name: "About", path: "about", component: About },
      ],
    },
    { name: "Login", path: "/login", component: Login },
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
