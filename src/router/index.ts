import { createRouter, createWebHistory } from "vue-router";
import AddTaskView from "../views/modals/AddTaskView.vue";
import TaskOverView from "../views/TaskOverView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/tasks",
    },
    {
      path: "/tasks",
      name: "tasks",
      component: TaskOverView,
      children: [
        {
          path: "task/:id",
          name: "showTask",
          component: AddTaskView,
          meta: { modalTitle: "Edit Task" },
          props: (route) => ({ id: route.params.id, mode: "edit" }),
        },
        {
          path: "add-task",
          name: "addTask",
          meta: { modalTitle: "Add Task", mode: "add" },
          component: AddTaskView,
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
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

export default router;
