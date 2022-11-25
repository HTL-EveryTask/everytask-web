<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { maxLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import IconUser from "@/components/icons/IconUser.vue";
import LoadingButton from "@/components/LoadingButton.vue";

const userStore = useUserStore();
const loading = ref(true);
const error = ref("");

const loadingEditProfile = ref(false);

const username = ref("");

const rules = {
  username: {
    required,
    maxLength: maxLength(32),
  },
};

const v$ = useVuelidate(rules, { username }, { $autoDirty: true });

onMounted(async () => {
  loading.value = true;
  await userStore.getMe();
  if (userStore.ME) {
    username.value = userStore.ME.username;
  } else {
    error.value = "Failed to load user";
  }

  loading.value = false;
  console.log(userStore.ME);
});

function updateProfile() {
  userStore.changeUsername(username.value);
}
</script>

<template>
  <div class="h-full p-4">
    <h1 class="text-2xl">My Profile</h1>
    <form v-if="!loading" @submit.prevent="updateProfile">
      <div class="flex gap-4">
        <div class="flex items-center">
          <IconUser class="w-40 h-40 rounded-full bg-raisin/5 text-raisin/50" />
        </div>
        <div class="flex-1 my-2">
          <InputField
            id="username"
            v-model="v$.username.$model"
            :validation="v$.username"
            label="Username"
          >
            <input v-model="v$.username.$model" class="w-full" type="text" />

            <template #right>
              <span class="text-raisin/50">
                {{ v$.username.$model.length }}/32</span
              >
            </template>
          </InputField>
          <InputField id="email" label="Email">
            <input
              :value="userStore.ME?.email"
              class="w-full"
              disabled
              type="text"
            />
          </InputField>
        </div>
      </div>
      <LoadingButton
        :loading="loadingEditProfile"
        class="mt-4 btn-primary"
        type="submit"
      >
        Update Profile
      </LoadingButton>
    </form>
    <div v-else>Loading...</div>
  </div>
</template>

<style scoped></style>
