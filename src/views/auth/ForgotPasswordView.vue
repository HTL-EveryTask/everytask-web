<script lang="ts" setup>
import LoadingButton from "@/components/LoadingButton.vue";
import InputField from "@/components/InputField.vue";
import { ref } from "vue";
import { email, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useAuthenticateStore } from "@/stores/auth";

const emailInput = ref("");
const loading = ref(false);

const success = ref(false);
const error = ref("");

const authStore = useAuthenticateStore();

const rules = {
  email: {
    required,
    email,
  },
};

const v$ = useVuelidate(rules, { email: emailInput }, { $autoDirty: true });

async function onSubmit() {
  loading.value = true;
  try {
    const response = await authStore.sendResetPasswordEmail(emailInput.value);
    if (response.ok) {
      success.value = true;
    } else {
      error.value = await response
        .json()
        .then((data: { message: any }) => data.message);
    }
  } catch {
    error.value = "Connection to the server could not be established";
  } finally {
    loading.value = false;
  }

  console.log(error.value);
  console.log(success.value);
}
</script>

<template>
  <div class="main-card bg-white max-w-[36em] sm:w-full sm:h-full mt-16">
    <header class="text-center">
      <h1 class="text-3xl font-bold mb-4">Reset Password</h1>
      <h2 class="text-sm text-gray-500 mb-4">
        Enter your email address and we'll send you a link to reset your
        password.
      </h2>
    </header>
    <form v-if="!success && !error" @submit.prevent="onSubmit">
      <InputField id="email" :validation="v$.email" label="Email">
        <input id="email" v-model="emailInput" type="email" />
      </InputField>
      <LoadingButton
        :disabled="v$.$invalid"
        :loading="loading"
        class="text-center bg-cerulean text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Reset password
      </LoadingButton>
    </form>
    <div v-else-if="success" class="text-center">
      <h2 class="text-sm text-green-500 mb-4">
        We've sent you an email with a link to reset your password.
      </h2>
      <router-link class="text-cerulean" to="/login">Back to login</router-link>
    </div>
    <div v-else-if="error" class="text-center">
      <h2 class="text-sm text-red-500 mb-4">{{ error }}</h2>

      <router-link class="text-cerulean" to="/login">Back to login</router-link>
    </div>
  </div>
</template>

<style scoped></style>
