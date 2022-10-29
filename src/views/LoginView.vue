<script lang="ts" setup>
import useVuelidate from "@vuelidate/core";
import { ref } from "vue";
import { minLength, required } from "@vuelidate/validators";
import InputField from "@/components/InputField.vue";

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

const v$ = useVuelidate(rules, { email, password }, { $autoDirty: true });

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
        <InputField id="email" :validation="v$.email" label="Email">
          <input id="email" v-model="email" type="email" />
        </InputField>

        <InputField id="password" :validation="v$.password" label="Password">
          <input id="password" v-model="password" type="password" />
        </InputField>
      </form>
    </div>
  </div>
</template>

<style></style>
