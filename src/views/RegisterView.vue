<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import InputField from "@/components/InputField.vue";
import { useAuthenticateStore } from "@/stores/auth";
import router from "@/router";
import LoadingButton from "@/components/LoadingButton.vue";

const username = ref("MyUserName");
const emailInput = ref("nayonyx@gmail.com");
const password = ref("MyPassword.");
const confirmPassword = ref("MyPassword.");

const loading = ref(false);

const emailInputElement = ref();

const currentErrors = ref<string[]>([]);

const rules = {
  username: {
    required,
    minLength: minLength(4),
  },
  email: {
    required,
    email: email,
  },
  password: {
    required,
    minLength: minLength(8),
    specialChar: helpers.withMessage(
      "Password must contain at least one special character",
      (value: string) => {
        return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value);
      }
    ),
    capitalLetter: helpers.withMessage(
      "Password must contain at least one capital letter",
      (value: string) => {
        return /[A-Z]+/.test(value);
      }
    ),
  },
  confirmPassword: {
    required,
    sameAsPassword: helpers.withMessage(
      "Passwords must match",
      (value: string) => {
        return value === password.value;
      }
    ),
  },
};

const v$ = useVuelidate(
  rules,
  {
    username,
    email: emailInput,
    password,
    confirmPassword,
  },
  { $autoDirty: true }
);

async function onSubmit() {
  const authenticateStore = useAuthenticateStore();
  loading.value = true;
  const response = await authenticateStore
    .register(username.value, emailInput.value, password.value)
    .catch(() => {
      currentErrors.value = ["Connection error"];
    });
  loading.value = false;

  console.log(response);
  if (response.type === "Success") {
    await router.push({ name: "login" });
  } else {
    emailInputElement.value.createError("Email already in use");
  }
}
</script>

<template>
  <div class="w-full">
    <div
      class="p-8 mt-12 mx-auto rounded-3xl flex justify-center content-center flex-col shadow-lg max-w-[36em] sm:w-full"
    >
      <h1 class="text-3xl text-center">Register to EveryTask</h1>
      <h2 class="text-center text-sm text-raisin/60">
        Already have an account?
        <router-link :to="{ name: 'login' }" class="underline text-raisin/80"
          >Login
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
        <InputField id="username" :validation="v$.username" label="Username">
          <input id="username" v-model="username" type="text" />
        </InputField>

        <InputField
          id="email"
          ref="emailInputElement"
          :input="emailInput"
          :validation="v$.email"
          label="Email"
        >
          <input id="email" v-model="emailInput" type="email" />
        </InputField>

        <InputField id="password" :validation="v$.password" label="Password">
          <input id="password" v-model="password" type="password" />
        </InputField>

        <InputField
          id="confirmPassword"
          :validation="v$.confirmPassword"
          label="Confirm Password"
        >
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
          />
        </InputField>
        <LoadingButton
          :disabled="v$.$invalid"
          class="bg-yonder text-white font-bold py-2 px-4 rounded"
          type="submit"
          :loading="loading"
        >
          Register
        </LoadingButton>
      </form>
    </div>
  </div>
</template>

<style></style>
