<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { helpers, minLength, required, email } from "@vuelidate/validators";

const username = ref("");
const emailInput = ref("");
const password = ref("");
const confirmPassword = ref("");

const rules = {
  username: {
    required,
    $autoDirty: true,
    minLength: minLength(4),
  },
  email: {
    required,
    $autoDirty: true,
    email: email,
  },
  password: {
    required,
    $autoDirty: true,
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
    $autoDirty: true,
    sameAsPassword: helpers.withMessage(
      "Passwords must match",
      (value: string) => {
        return value === password.value;
      }
    ),
  },
};

const v$ = useVuelidate(rules, {
  username,
  email: emailInput,
  password,
  confirmPassword,
});

function onSubmit() {
  console.log("submitted");
}
</script>

<template>
  <div class="w-full">
    <div
      class="p-8 mt-12 mx-auto rounded-3xl flex justify-center content-center flex-col shadow-lg max-w-[36em] sm:w-full"
    >
      <h1 class="text-3xl text-center">Register to EveryTask</h1>

      <form @submit.prevent="onSubmit">
        <div class="form-control">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" />
          <span
            v-for="error in v$.username.$errors"
            :key="error"
            class="input-error"
            >{{ error.$message }}</span
          >
        </div>
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="emailInput" type="email" />
          <span
            v-for="error in v$.email.$errors"
            :key="error"
            class="input-error"
            >{{ error.$message }}</span
          >
        </div>
        <div>
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" />
          <span
            v-for="error in v$.password.$errors"
            :key="error"
            class="input-error"
            >{{ error.$message }}</span
          >
        </div>
        <div>
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
          />
          <span
            v-for="error in v$.confirmPassword.$errors"
            :key="error"
            class="input-error"
            >{{ error.$message }}</span
          >
        </div>
        <button :disabled="v$.$invalid" class="btn-primary" type="submit">
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<style></style>
