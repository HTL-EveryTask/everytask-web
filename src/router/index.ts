import { createRouter, createWebHistory } from "vue-router";
import EditTaskView from "../views/modals/EditTaskView.vue";
import CreateGroupView from "../views/modals/CreateGroupView.vue";
import GroupOverView from "../views/GroupOverView.vue";
import TaskOverView from "../views/TaskOverView.vue";
import EditGroupView from "../views/modals/EditGroupView.vue";
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
      component: TaskOverView,
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
      component: GroupOverView,
      children: [
        {
          path: "/create",
          name: "createGroup",
          component: CreateGroupView,
          meta: { modalTitle: "Create Group" },
        },
        {
          path: "group/:id",
          name: "showGroup",
          component: EditGroupView,
          meta: { modalTitle: "Edit Group" },
          props: (route) => ({ id: Number(route.params.id) }),
        },
      ],
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
    {
      path: "/activate",
      name: "activate",
      meta: { hideNavBar: true },
      component: () => import("../views/ActivateView.vue"),
      props: (route) => ({ code: route.query.activation_code }),
    },
  ],
});

export default router;
