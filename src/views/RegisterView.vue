<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import InputField from "@/components/InputField.vue";
import { useAuthenticateStore } from "@/stores/auth";
import LoadingButton from "@/components/LoadingButton.vue";

const username = ref("Mephisto");
const emailInput = ref("htl.everytask@gmail.com");
const password = ref("AugenbraueHoch2!");
const confirmPassword = ref("AugenbraueHoch2!");

const showForm = ref(true);
const loading = ref(false);

const emailInputElement = ref();

const currentError = ref("");

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
  currentError.value = "";
  try {
    const response = await authenticateStore.register(
      username.value,
      emailInput.value,
      password.value
    );
    if (response.ok) {
      showForm.value = false;
    } else {
      currentError.value = await response.json().then((data) => data.message);
    }
  } catch (error: any) {
    currentError.value = "Connection to the server could not be established";
  } finally {
    loading.value = false;
  }
}

function resendVerificationMail() {
  const authenticateStore = useAuthenticateStore();
  authenticateStore.resendVerificationEmail(emailInput.value);
}
</script>

<template>
  <div class="w-full h-full">
    <div
      class="p-8 sm:p-4 mx-auto rounded-3xl sm:rounded-none flex flex-col shadow-lg shadow-yonder/10 max-w-[36em] sm:w-full sm:h-full bg-white mt-16"
    >
      <div class="mb-6 mt-2">
        <img
          alt="logo"
          class="h-24 mx-auto"
          src="@/assets/logo_symbol_light.svg"
        />
      </div>
      <h1 class="text-3xl text-center">Register to EveryTask</h1>
      <h2 class="text-center text-sm text-raisin/60">
        Already have an account?
        <router-link :to="{ name: 'login' }" class="underline text-raisin/80"
          >Login
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

      <form v-if="showForm" class="px-8" @submit.prevent="onSubmit">
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
          :loading="loading"
          class="bg-yonder text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Register
        </LoadingButton>
      </form>
      <div v-else class="px-8 mb-4 flex flex-col items-center text-center">
        <h2 class="text-center text-xl m-4">Verification Mail sent</h2>
        <p class="text-raisin/80 m-2">
          Please check your inbox and click on the link in the verification mail
          to verify your account.
        </p>
        <button
          class="text-center bg-cerulean text-white font-bold py-2 px-4 rounded"
          type="submit"
          @click="resendVerificationMail"
        >
          Resend Verification Mail
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
