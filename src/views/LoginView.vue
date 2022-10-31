<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { email, minLength, required } from "@vuelidate/validators";
import InputField from "@/components/InputField.vue";
import { useAuthenticateStore } from "@/stores/auth";
import router from "@/router";

const currentErrors = ref<string[]>([]);

const emailInput = ref("nayonyx@gmail.com");
const password = ref("MyPassword.");

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
  const response = await authenticateStore.login(
    emailInput.value,
    password.value
  );

  console.log(response);
  // if the response is successful, router push to the route named login
  if (response.type === "Success") {
    await router.push({ name: "home" });
  } else {
    // make the error the first element of the array
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

        <div class="flex justify-center">
          <button
            type="submit"
            class="bg-cerulean hover:bg-gradient-to-r hover:from-cerulean hover:to-cerulean-dark text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style></style>
