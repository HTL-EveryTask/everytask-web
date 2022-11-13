<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { email, minLength, required } from "@vuelidate/validators";
import InputField from "@/components/InputField.vue";
import { useAuthenticateStore } from "@/stores/auth";
import router from "@/router";
import LoadingButton from "@/components/LoadingButton.vue";

const currentErrors = ref<string[]>([]);

const emailInput = ref("nayonyx@gmail.com");
const password = ref("MyPassword.");

const loading = ref(false);

const rules = {
  email: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLength(8),
  },
};

const v$ = useVuelidate(
  rules,
  { email: emailInput, password },
  { $autoDirty: true }
);

async function onSubmit() {
  const authenticateStore = useAuthenticateStore();
  loading.value = true;
  const response = await authenticateStore
    .login(emailInput.value, password.value)
    .catch(() => {
      console.log("hi");
      currentErrors.value = ["Connection error"];
    });
  loading.value = false;

  if (response.type === "Success") {
    await router.push({ name: "tasks" });
  } else {
    currentErrors.value = [response.message];
  }
}
</script>

<template>
  <div class="w-full">
    <div
      class="p-8 mt-12 mx-auto rounded-3xl flex justify-center content-center flex-col shadow-lg max-w-[36em] sm:w-full"
    >
      <h1 class="text-3xl text-center">Login to EveryTask</h1>
      <h2 class="text-center text-sm text-raisin/60">
        Don't have an account?
        <router-link :to="{ name: 'register' }" class="underline text-raisin/80"
          >Register
        </router-link>
      </h2>

      <div class="min-h-[5em] flex">
        <ul
          v-if="currentErrors.length > 0"
          class="m-4 bg-red-500 bg-opacity-10 border-2 border-red-500 text-red-500 flex flex-col items-center justify-center w-full rounded-lg list-disc"
        >
          <li v-for="error in currentErrors" :key="error">
            {{ error }}
          </li>
        </ul>
      </div>

      <form @submit.prevent="onSubmit">
        <InputField id="email" :validation="v$.email" label="Email">
          <input id="email" v-model="emailInput" type="email" />
        </InputField>

        <InputField id="password" :validation="v$.password" label="Password">
          <input
            id="password"
            v-model="password"
            class="w-full"
            type="password"
          />
        </InputField>

        <LoadingButton
          :disabled="v$.$invalid"
          class="text-center bg-cerulean text-white font-bold py-2 px-4 rounded"
          type="submit"
          :loading="loading"
        >
          Login
        </LoadingButton>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
