<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { minLength, required } from "@vuelidate/validators";

const email = ref("");
const password = ref("");

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

const v$ = useVuelidate(rules, { email, password });

function onSubmit() {
  console.log("submitted");
}
</script>

<template>
  <div class="w-full">
    <div
      class="p-8 mt-12 mx-auto rounded-3xl flex justify-center content-center flex-col shadow-lg max-w-[36em] sm:w-full"
    >
      <h1 class="text-3xl text-center">Login to EveryTask</h1>

      <form @submit.prevent="onSubmit">
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" />
          <span v-if="v$.email.$error" class="input-error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
        <div>
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" />
          <span v-if="v$.password.$error" class="input-error">{{
            v$.password.$errors[0].$message
          }}</span>
        </div>
        <div>
          <button class="btn-primary" type="submit">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style></style>
