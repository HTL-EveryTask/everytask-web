import { createRouter, createWebHistory } from "vue-router";
import EditTaskView from "../views/modals/EditTaskView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundView,
    },
    {
      path: "/",
      redirect: { name: "tasks" },
    },
    {
      path: "/tasks",
      name: "tasks",
      component: () => import("../views/TaskOverView.vue"),
      children: [
        {
          path: "task/:id",
          name: "showTask",
          component: EditTaskView,
          meta: { modalTitle: "Edit Task" },
          props: (route) => ({ id: Number(route.params.id) }),
        },
      ],
    },
    {
      path: "/groups",
      name: "groups",
      component: () => import("../views/GroupOverView.vue"),
    },
    {
      path: "/register",
      name: "register",
      meta: { hideNavBar: true },
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/login",
      name: "login",
      meta: { hideNavBar: true },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/LoginView.vue"),
    },
  ],
});

export default router;
