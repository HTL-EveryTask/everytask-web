<script lang="ts" setup>
import { ref } from "vue";
import InputField from "@/components/InputField.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import { useToastStore } from "@/stores/toast";
import { useAuthenticateStore } from "@/stores/auth";
import ProfileCard from "@/components/ProfileCard.vue";
import ChangePassword from "@/views/settings/ChangePassword.vue";

const showChangePasswordModal = ref(false);

const showDeleteAccountModal = ref(false);
const deleteAccountLoading = ref(false);

const deleteConfirmPassword = ref("");

function deleteAccount() {
  const authStore = useAuthenticateStore();
  deleteAccountLoading.value = true;
  authStore
    .deleteAccount(deleteConfirmPassword.value)
    .then((response) => {
      if (response.ok) {
        useToastStore().addToast({
          title: "Account deleted",
          message: "Your account has been deleted successfully",
          type: "success",
        });
        authStore.logout();
      } else {
        useToastStore().addToast({
          title: "Account deletion failed",
          message: "Your account could not be deleted",
          type: "error",
        });
      }
    })
    .catch(() => {
      useToastStore().addToast({
        title: "Account deletion failed",
        message: "Your account could not be deleted",
        type: "error",
      });
    })
    .finally(() => {
      deleteAccountLoading.value = false;
      showDeleteAccountModal.value = false;
    });
}
</script>

<template>
  <div class="h-full p-4 relative">
    <section>
      <h2 class="text-2xl">My Profile</h2>
      <ProfileCard />
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
          <ChangePassword />
        </ModalContainer>
      </div>
    </section>
    <section class="mt-8">
      <h2 class="text-2xl">Delete Account</h2>
      <div class="my-4">
        <button class="btn-red" @click="showDeleteAccountModal = true">
          Delete Account
        </button>
        <ModalContainer
          :show="showDeleteAccountModal"
          class="bg-white w-[30rem]"
          effect="shadow"
          relative
          title="Delete Account"
          @close="showDeleteAccountModal = false"
        >
          <form
            class="p-4 pt-0 flex flex-col gap-4"
            @submit.prevent="deleteAccount"
          >
            <p
              class="text-raisin/50 p-2 border-2 border-red-500 rounded-lg text-red-500 bg-red-500/5"
            >
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <InputField
              id="confirm-password"
              v-model="deleteConfirmPassword"
              label="Confirm Password"
            >
              <PasswordInput
                id="confirm-password"
                v-model="deleteConfirmPassword"
                class="w-full"
              />
            </InputField>
            <LoadingButton
              :disabled="deleteAccountLoading"
              :loading="deleteAccountLoading"
              class="btn-red"
              type="submit"
            >
              Delete Account
            </LoadingButton>
          </form>
        </ModalContainer>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
