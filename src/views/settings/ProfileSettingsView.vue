<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { helpers, maxLength, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import IconUser from "@/components/icons/IconUser.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import { useToastStore } from "@/stores/toast";
import { useAuthenticateStore } from "@/stores/auth";

const userStore = useUserStore();
const loading = ref(true);
const error = ref("");

const loadingEditProfile = ref(false);

const username = ref("");

const showChangePasswordModal = ref(false);

const rules = {
  username: {
    required,
    maxLength: maxLength(32),
  },
};

const changePasswordValues = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  loading: false,
});

const rulesChangePassword = {
  oldPassword: {
    required,
  },
  newPassword: {
    required,
    minLength: minLength(8),
    specialChar: helpers.withMessage(
      "Password must contain at least one special character",
      (value: string) => {
        return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value);
      }
    ),
  },
  newPasswordConfirm: {
    required,
    sameAsPassword: helpers.withMessage(
      "Passwords must match",
      (value: string) => {
        return value === changePasswordValues.value.newPassword;
      }
    ),
  },
};

const vProfile$ = useVuelidate(rules, { username }, { $autoDirty: true });
const vChangePassword$ = useVuelidate(
  rulesChangePassword,
  {
    oldPassword: changePasswordValues.value.currentPassword,
    newPassword: changePasswordValues.value.newPassword,
    newPasswordConfirm: changePasswordValues.value.confirmPassword,
  },
  { $autoDirty: true }
);
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

async function updateProfile() {
  try {
    const response = await userStore.changeUsername(username.value);
    if (response.ok) {
      useToastStore().addToast({
        title: "Success",
        message: "Successfully updated profile",
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

async function changePassword() {
  changePasswordValues.value.loading = true;
  try {
    const response = await useAuthenticateStore().changePassword(
      changePasswordValues.value.currentPassword,
      changePasswordValues.value.newPassword
    );

    if (response.ok) {
      useToastStore().addToast({
        title: "Password changed",
        message: "Your password has been changed successfully",
        type: "success",
      });
    } else {
      useToastStore().addToast({
        title: "Password change failed",
        message: "Your password could not be changed",
        type: "error",
      });
    }
  } catch (e) {
    changePasswordValues.value.loading = false;
    showChangePasswordModal.value = false;
    useToastStore().addToast({
      title: "Password change failed",
      message: "Your password could not be changed",
      type: "error",
    });
  } finally {
    changePasswordValues.value.loading = false;
    showChangePasswordModal.value = false;
  }
}
</script>

<template>
  <div class="h-full p-4 relative">
    <section>
      <h2 class="text-2xl">My Profile</h2>
      <div class="main-card bg-white my-4">
        <form v-if="!loading" @submit.prevent="updateProfile">
          <div class="flex gap-4">
            <div class="flex items-center">
              <IconUser
                class="w-40 h-40 rounded-full bg-raisin/5 text-raisin/50"
              />
            </div>
            <div class="flex-1 my-2">
              <InputField
                id="username"
                v-model="vProfile$.username.$model"
                :validation="vProfile$.username"
                label="Username"
              >
                <input
                  v-model="vProfile$.username.$model"
                  class="w-full"
                  type="text"
                />

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
            :disabled="vProfile$.$invalid"
            :loading="loadingEditProfile"
            class="mt-4 btn-primary"
            type="submit"
          >
            Update Profile
          </LoadingButton>
        </form>
        <div
          v-else
          class="h-full min-h-[16rem] flex items-center justify-center"
        >
          <IconSpinner class="w-12 h-12" />
        </div>
      </div>
    </section>
    <section class="mt-8">
      <h2 class="text-2xl">Change Password</h2>
      <div class="my-4">
        <button class="btn-primary" @click="showChangePasswordModal = true">
          Change Password
        </button>
        <ModalContainer
          :show="showChangePasswordModal"
          class="bg-white w-[30rem]"
          relative
          title="Change Password"
          @close="showChangePasswordModal = false"
        >
          <form class="p-4" @submit.prevent="changePassword">
            <InputField
              id="current-password"
              :validation="vChangePassword$.oldPassword"
              label="Current Password"
            >
              <PasswordInput
                id="current-password"
                v-model="changePasswordValues.currentPassword"
                autocomplete="new-password"
                class="w-full"
              />
            </InputField>
            <InputField
              id="new-password"
              :validation="vChangePassword$.newPassword"
              label="New Password"
            >
              <PasswordInput
                id="new-password"
                v-model="changePasswordValues.newPassword"
                class="w-full"
              />
            </InputField>
            <InputField
              id="confirm-password"
              :validation="vChangePassword$.newPasswordConfirm"
              label="Confirm Password"
            >
              <PasswordInput
                id="confirm-password"
                v-model="changePasswordValues.confirmPassword"
                class="w-full"
              />
            </InputField>
            <LoadingButton
              :loading="changePasswordValues.loading"
              :disabled="vChangePassword$.$invalid"
              class="mt-4 btn-primary"
              type="submit"
            >
              Update Password
            </LoadingButton>
          </form>
        </ModalContainer>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
