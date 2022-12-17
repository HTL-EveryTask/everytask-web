<script lang="ts" setup>
import { ref } from "vue";
import { helpers, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import { useToastStore } from "@/stores/toast";
import { useAuthenticateStore } from "@/stores/auth";
import { useApiStore } from "@/stores/api";

const showChangePasswordModal = ref(false);

const oldPassword = ref("");
const newPassword = ref("");
const newPasswordConfirm = ref("");
const loadingChangePassword = ref(false);

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
        return value === newPassword.value;
      }
    ),
  },
};

const v$ = useVuelidate(
  rulesChangePassword,
  {
    oldPassword,
    newPassword,
    newPasswordConfirm,
  },
  { $autoDirty: true }
);

async function changePassword() {
  loadingChangePassword.value = true;
  try {
    const response = await useAuthenticateStore().changePassword(
      oldPassword.value,
      newPassword.value
    );

    if (response.ok) {
      useToastStore().addToast({
        title: "Password changed",
        message: "Your password has been changed successfully",
        type: "success",
      });
      showChangePasswordModal.value = false;
      // clear fields
      oldPassword.value = "";
      newPassword.value = "";
      newPasswordConfirm.value = "";

      // set new token
      const newToken = await response.json().then((data) => data.token);
      await useApiStore().setToken(newToken);
    } else {
      useToastStore().addToast({
        title: "Password change failed",
        message: "Your password could not be changed",
        type: "error",
      });
    }
  } catch (e) {
    useToastStore().addToast({
      title: "Password change failed",
      message: "Your password could not be changed",
      type: "error",
    });
  } finally {
    loadingChangePassword.value = false;
  }
}
</script>

<template>
  <form class="p-4" @submit.prevent="changePassword">
    <InputField
      id="current-password"
      :validation="v$.oldPassword"
      label="Current Password"
    >
      <PasswordInput
        id="current-password"
        v-model="oldPassword"
        class="w-full"
      />
    </InputField>
    <InputField
      id="new-password"
      :validation="v$.newPassword"
      label="New Password"
    >
      <PasswordInput id="new-password" v-model="newPassword" class="w-full" />
    </InputField>
    <InputField
      id="confirm-password"
      :validation="v$.newPasswordConfirm"
      label="Confirm Password"
    >
      <PasswordInput
        id="confirm-password"
        v-model="newPasswordConfirm"
        class="w-full"
      />
    </InputField>
    <LoadingButton
      :disabled="v$.$invalid"
      :loading="loadingChangePassword"
      class="mt-4 btn-primary"
      type="submit"
    >
      Update Password
    </LoadingButton>
  </form>
</template>

<style scoped></style>
