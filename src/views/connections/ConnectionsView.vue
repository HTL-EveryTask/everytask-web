<script lang="ts" setup>
import IconConnections from "@/components/icons/IconConnections.vue";
import IconClock from "@/components/icons/IconClock.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import { onMounted, ref } from "vue";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import { useUntisStore } from "@/stores/untis";
import { useConnectionStore } from "@/stores/connection";

const connectionStore = useConnectionStore();

const connections = ref();

onMounted(async () => {
  const response = await connectionStore.checkConnections();
  connections.value = await response.json();
});

const showWebUntisModal = ref(false);
const serverUrl = ref("");
const username = ref("htl3r");
const password = ref("htl3r");
const school = ref("htl3r");

const rules = {
  serverUrl: {
    required,
  },
  username: {
    required,
  },
  password: {
    required,
  },
  school: {
    required,
  },
};

const $v = useVuelidate(
  rules,
  {
    serverUrl,
    username,
    password,
    school,
  },
  { $autoDirty: true }
);

function connectWebUntis() {
  useUntisStore().createSession(
    username.value,
    password.value,
    school.value,
    serverUrl.value
  );
}
</script>

<template>
  <div class="h-full overflow-y-hidden">
    <div class="main-card max-w-[48em] sm:w-full sm:h-full bg-ghost mt-16">
      <header>
        <IconConnections class="w-14 h-14 mx-auto mt-8 text-raisin/70" />
      </header>
      <h1 class="text-3xl font-bold text-center mt-8">Connections</h1>
      <p class="font-bold text-lg text-center m-8">
        Connections allow you to connect to your favorite services to further
        enhance your experience.
      </p>

      <section class="mt-8 flex flex-col gap-4">
        <div class="connection-card">
          <div class="w-24 h-24 p-4 mx-2 bg-ghost rounded-2xl">
            <IconClock class="text-raisin/70" />
          </div>
          <div class="flex flex-col flex-1 m-2">
            <div class="flex flex-col flex-1 ml-0">
              <div class="font-bold text-lg">WebUntis</div>
              <div class="text-sm text-raisin/70">
                WebUntis helps you to manage your school schedule.
              </div>
            </div>
            <div class="flex items-center mt-2">
              <button
                class="bg-yonder/10 text-raisin/70 rounded-full px-4 py-2 text-sm font-bold hover:bg-yonder/20 transition-colors duration-300"
                @click="showWebUntisModal = true"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
        <div class="connection-card">
          <div class="w-24 h-24 p-4 mx-2 bg-ghost rounded-2xl">
            <IconClock class="text-raisin/70" />
          </div>
          <div class="flex flex-col flex-1 m-2">
            <div class="flex flex-col flex-1 ml-0">
              <div class="font-bold text-lg">Microsoft Teams</div>
              <div class="text-sm text-raisin/70">
                Microsoft Teams is a chat-based collaboration tool.
              </div>
            </div>
            <div class="flex items-center mt-2">
              <button
                class="bg-yonder/10 text-raisin/70 rounded-full px-4 py-2 text-sm font-bold hover:bg-yonder/20 transition-colors duration-300"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    <ModalContainer
      :show="showWebUntisModal"
      class="w-[30rem] bg-white"
      effect="shadow"
      title="WebUntis"
      @close="showWebUntisModal = false"
    >
      <form @submit.prevent="connectWebUntis">
        <div class="flex flex-col gap-4">
          <InputField
            id="serverUrl"
            v-model="serverUrl"
            :validation="$v.serverUrl"
            label="Server-URL"
          >
            <input
              v-model="serverUrl"
              class="w-full px-4 py-2 rounded-lg border border-raisin/20 focus:border-raisin/50 focus:outline-none"
              type="text"
            />
          </InputField>
          <InputField
            id="username"
            v-model="username"
            :validation="$v.username"
            label="Username"
          >
            <input
              v-model="username"
              class="w-full px-4 py-2 rounded-lg border border-raisin/20 focus:border-raisin/50 focus:outline-none"
              type="text"
            />
          </InputField>
          <InputField
            id="password"
            v-model="password"
            :validation="$v.password"
            label="Password"
          >
            <input
              v-model="password"
              class="w-full px-4 py-2 rounded-lg border border-raisin/20 focus:border-raisin/50 focus:outline-none"
              type="password"
            />
          </InputField>
          <InputField
            id="school"
            v-model="school"
            :validation="$v.school"
            label="School"
          >
            <input
              v-model="school"
              class="w-full px-4 py-2 rounded-lg border border-raisin/20 focus:border-raisin/50 focus:outline-none"
              type="text"
            />
          </InputField>

          <button
            class="bg-raisin/50 text-white rounded-full px-4 py-2 text-sm font-bold hover:bg-raisin/70 transition-colors duration-300"
            type="submit"
          >
            Connect
          </button>
        </div>
      </form>
    </ModalContainer>
    <p class="text-center text-raisin/70 mt-8">
      {{ connections }}
    </p>
  </div>
</template>

<style scoped>
.connection-card {
  @apply w-full h-32 p-2 bg-white rounded-xl flex items-center;
}
</style>
