<script lang="ts" setup>
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { maxLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import { useToastStore } from "@/stores/toast";
import IconPlus from "@/components/icons/IconPlus.vue";

const userStore = useUserStore();
const loading = ref(true);
const loadingEditProfile = ref(false);
const error = ref("");

const pictures: Ref<any[]> = ref([]);

const username = ref("");

const uploadedPictureData = ref("");

onMounted(async () => {
  loading.value = true;
  await userStore.getMe();
  pictures.value = await userStore.getAllProfilePictures();
  if (userStore.ME) {
    username.value = userStore.ME.username;
  } else {
    error.value = "Failed to load user";
  }

  loading.value = false;
  console.log(userStore.ME);
});

const rules = {
  username: {
    required,
    maxLength: maxLength(32),
  },
};

const v$ = useVuelidate(rules, { username }, { $autoDirty: true });

async function updateProfile() {
  try {
    let response = await userStore.changeUsername(username.value);
    if (uploadedPictureData.value) {
      response = await userStore.changeProfilePicture(
        uploadedPictureData.value
      );
    }
    if (response.ok) {
      useToastStore().addToast({
        title: "Profile updated",
        message: "Your profile has been updated",
        type: "success",
      });
    } else {
      const msg = await response.json().then((data) => data.message);
      useToastStore().addToast({
        title: "Error",
        message: msg || "Failed to update profile",
        type: "error",
      });
    }
  } catch (e) {
    useToastStore().addToast({
      title: "Error",
      message: "Failed to update profile",
      type: "error",
    });
  }
}

function uploadPicture() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          uploadedPictureData.value = data.toString();
        }
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}
</script>

<template>
  <div class="main-card bg-white my-4">
    <form v-if="!loading" @submit.prevent="updateProfile">
      <div class="flex gap-4">
        <div
          class="flex items-center relative overflow-visible"
          @click="uploadPicture"
        >
          <img
            v-if="uploadedPictureData"
            :src="uploadedPictureData"
            alt="Profile Picture"
            class="w-40 h-40 rounded-full shadow-lg shadow-yonder/10 border-2 border-raisin/70"
          />
          <img
            v-else-if="userStore.ME?.profile_picture"
            :src="`data:image/png;base64,${userStore.ME.profile_picture}`"
            alt="Profile Picture"
            class="w-40 h-40 rounded-full shadow-lg shadow-yonder/10 border-2 border-raisin/70"
          />

          <IconPlus
            v-else
            class="w-40 h-40 p-8 rounded-full bg-raisin/5 text-raisin/50 hover:bg-raisin/10 cursor-pointer active:bg-raisin/20"
          />
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
              <span class="text-raisin/50"> {{ username.length }}/32</span>
            </template>
          </InputField>
          <InputField id="email" label="Email">
            <input
              :value="userStore.ME?.email"
              class="w-full text-raisin/50"
              disabled
              type="text"
            />
          </InputField>
        </div>
      </div>
      <LoadingButton
        :disabled="v$.$invalid"
        :loading="loadingEditProfile"
        class="mt-4 btn-primary"
        type="submit"
      >
        Update Profile
      </LoadingButton>
    </form>
    <div v-else class="h-full min-h-[16rem] flex items-center justify-center">
      <IconSpinner class="w-12 h-12" />
    </div>
  </div>
</template>

<style scoped></style>
