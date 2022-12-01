<script lang="ts" setup>
import { useToastStore } from "@/stores/toast";
import { ref } from "vue";
import { helpers, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { useAuthenticateStore } from "@/stores/auth";

const props = defineProps<{
  code: string;
}>();

const authStore = useAuthenticateStore();

const showChangePasswordModal = ref(false);

const newPassword = ref("");
const confirmPassword = ref("");
const loadingChangePassword = ref(false);

const rulesChangePassword = {
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
    newPassword: newPassword,
    newPasswordConfirm: confirmPassword,
  },
  { $autoDirty: true }
);

async function changePassword() {
  loadingChangePassword.value = true;
  try {
    const response = await authStore.resetPassword(
      newPassword.value,
      props.code
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
    console.error(e);
    loadingChangePassword.value = false;
    showChangePasswordModal.value = false;
    useToastStore().addToast({
      title: "Password change failed",
      message: "Your password could not be changed",
      type: "error",
    });
  } finally {
    loadingChangePassword.value = false;
    showChangePasswordModal.value = false;
  }
}
</script>

<template>
  <form
    class="main-card bg-white mt-16 max-w-[36em] sm:w-full sm:h-full"
    @submit.prevent="changePassword"
  >
    <h1 class="text-2xl font-bold mb-4 text-center">Change password</h1>
    <InputField
      id="new-password"
      :validation="v$.newPassword"
      label="New Password"
    >
      <PasswordInput
        id="new-password"
        v-model="newPassword"
        class="w-full"
        autocomplete="new-password"
      />
    </InputField>
    <InputField
      id="confirm-password"
      :validation="v$.newPasswordConfirm"
      label="Confirm Password"
    >
      <PasswordInput
        id="confirm-password"
        v-model="confirmPassword"
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
