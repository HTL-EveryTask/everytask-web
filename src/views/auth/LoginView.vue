<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { email, minLength, required } from "@vuelidate/validators";
import InputField from "@/components/InputField.vue";
import { useAuthenticateStore } from "@/stores/auth";
import router from "@/router";
import LoadingButton from "@/components/LoadingButton.vue";
import PasswordInput from "@/components/PasswordInput.vue";

const currentError = ref("");

const emailInput = ref("htl.everytask@gmail.com");
const password = ref("password123!");

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
  try {
    const response = await authenticateStore.login(
      emailInput.value,
      password.value
    );
    if (response.ok) {
      await router.push({ name: "tasks" });
    } else {
      currentError.value = await response.json().then((data) => data.message);
    }
  } catch (error: any) {
    currentError.value = "Connection to the server could not be established";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="w-full h-full overflow-y-hidden">
    <div class="main-card max-w-[36em] sm:w-full sm:h-full bg-white mt-16">
      <div class="mb-6 mt-2">
        <img
          alt="logo"
          class="h-24 mx-auto"
          src="@/assets/logo_symbol_light.svg"
        />
      </div>
      <h1 class="text-3xl text-center">Login to EveryTask</h1>
      <h2 class="text-center text-sm text-raisin/60">
        Don't have an account?
        <router-link :to="{ name: 'register' }" class="underline text-raisin/80"
          >Register
        </router-link>
      </h2>

      <div class="min-h-[5em] flex">
        <ul
          v-if="currentError"
          class="m-4 bg-red-500 bg-opacity-10 border-2 border-red-500 text-red-500 flex flex-col items-center justify-center w-full rounded-xl list-disc"
        >
          <li>
            {{ currentError }}
          </li>
        </ul>
      </div>

      <form class="px-8" @submit.prevent="onSubmit">
        <InputField id="email" :validation="v$.email" label="Email">
          <input id="email" v-model="emailInput" type="email" />
        </InputField>

        <InputField id="password" :validation="v$.password" label="Password">
          <PasswordInput id="password" v-model="password" class="w-full" />
        </InputField>

        <LoadingButton
          :disabled="v$.$invalid"
          :loading="loading"
          class="text-center bg-cerulean text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Login
        </LoadingButton>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
