import { ref } from "vue";
import { defineStore } from "pinia";
import type { Task } from "@/models/Task";
import type { User } from "@/models/User";

export const useMockStore = defineStore("mock", () => {
  const tasks = ref<Task[]>([
    {
      pk_task_id: "1",
      title: "Task 1",
      description: "Description 1",
      is_done: false,
      due_time: "2021-01-01",
    },
    {
      pk_task_id: "2",
      title: "Task 2",
      description: "Description 2",
      is_done: false,
      due_time: "2021-01-02",
    },
  ]);

  const users = ref<User[]>([
    {
      id: 1,
      name: "User 1",
    },
    {
      id: 2,
      name: "User 2",
    },
    {
      id: 3,
      name: "User 3",
    },
  ]);

  const deleteTask = (pk_task_id: string) => {
    tasks.value = tasks.value.filter((task) => task.pk_task_id !== pk_task_id);
  };

  const addTask = (task: Task) => {
    tasks.value.push(task);
  };

  const updateTask = (task: Task) => {
    const index = tasks.value.findIndex(
      (t) => t.pk_task_id === task.pk_task_id
    );
    tasks.value[index] = task;
  };

  return { tasks, users, deleteTask, addTask, updateTask };
});
