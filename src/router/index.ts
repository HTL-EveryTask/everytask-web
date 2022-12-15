import { createRouter, createWebHistory } from "vue-router";
import EditTaskView from "../views/task/EditTaskView.vue";
import CreateGroupView from "../views/group/CreateGroupView.vue";
import GroupOverView from "../views/group/GroupOverView.vue";
import TaskOverView from "../views/task/TaskOverView.vue";
import EditGroupView from "../views/group/EditGroupView.vue";
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
      path: "/tasks/:type",
      name: "tasks",
      component: TaskOverView,
      props: true,
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
      path: "/tasks",
      redirect: { name: "tasks", params: { type: "all" } },
    },
    {
      path: "/groups",
      name: "groups",
      component: GroupOverView,
      children: [
        {
          path: "create",
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
      path: "/connections",
      name: "connections",
      component: () => import("../views/connections/ConnectionsView.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/settings/SettingsView.vue"),
      children: [
        {
          path: "profile",
          name: "profileSettings",
          component: () => import("../views/settings/ProfileSettingsView.vue"),
        },
      ],
      redirect: { name: "profileSettings" },
    },
    {
      path: "/register",
      name: "register",
      meta: { hideNavBar: true },
      component: () => import("../views/auth/RegisterView.vue"),
    },
    {
      path: "/login",
      name: "login",
      meta: { hideNavBar: true },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/auth/LoginView.vue"),
    },
    {
      path: "/forgot-password",
      name: "forgotPassword",
      meta: { hideNavBar: true },
      component: () => import("../views/auth/ForgotPasswordView.vue"),
    },
    {
      path: "/reset",
      name: "resetPassword",
      meta: { hideNavBar: true },
      component: () => import("../views/ext/ChangePasswordView.vue"),
      props: (route) => ({ code: route.query.code }),
    },
    {
      path: "/activate",
      name: "activate",
      meta: { hideNavBar: true },
      component: () => import("../views/ext/ActivateView.vue"),
      props: (route) => ({ code: route.query.activation_code }),
    },
    {
      path: "/invite",
      name: "invite",
      meta: { hideNavBar: true },
      component: () => import("../views/ext/InviteView.vue"),
      props: (route) => ({ code: route.query.code }),
    },
  ],
});

export default router;
