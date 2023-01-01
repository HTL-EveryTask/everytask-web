import { defineStore } from "pinia";
import { useApiStore } from "@/stores/api";
import { ref } from "vue";
import type { Subject } from "@/models/Subject";

export const useUntisStore = defineStore("untis", () => {
  const api = useApiStore();

  const subjects = ref<Subject[]>([]);

  async function createSession(
    username: string,
    password: string,
    school: string,
    server: string
  ) {
    return await api.callApi("untis", "PUT", {
      username: username,
      password: password,
      school: school,
      server: server,
    });
  }

  async function getSubjects() {
    const response = await api.callApi("subjects", "GET");
    if (response.ok) {
      subjects.value = await response.json().then((data) => data.subjects);
    }
    return response;
  }

  return {
    subjects,
    createSession,
    getSubjects,
  };
});
