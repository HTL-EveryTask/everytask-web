<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { helpers, maxLength, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import InputField from "@/components/InputField.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import PasswordInput from "@/components/PasswordInput.vue";
import { useToastStore } from "@/stores/toast";
import { useAuthenticateStore } from "@/stores/auth";
import { useApiStore } from "@/stores/api";
import IconPlus from "@/components/icons/IconPlus.vue";
import IconX from "@/components/icons/IconX.vue";

const userStore = useUserStore();
const pictures = ref([]);
const showPicturePopup = ref(false);
const selectedPicture = ref(null);

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

const vProfile$ = useVuelidate(rules, { username }, { $autoDirty: true });
const vChangePassword$ = useVuelidate(
  rulesChangePassword,
  {
    oldPassword,
    newPassword,
    newPasswordConfirm,
  },
  { $autoDirty: true }
);
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

async function updateProfile() {
  try {
    let response = await userStore.changeUsername(username.value);
    if (selectedPicture.value) {
      await userStore.changeProfilePicture(selectedPicture.value);
    }
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
      <div class="main-card bg-white my-4">
        <form v-if="!loading" @submit.prevent="updateProfile">
          <div class="flex gap-4">
            <div
              class="flex items-center relative overflow-visible"
              @click="showPicturePopup = !showPicturePopup"
            >
              <img
                v-if="
                  selectedPicture &&
                  pictures.find((p) => p.id === selectedPicture.id)
                "
                :src="`data:image/png;base64,${selectedPicture.picture}`"
                alt="Profile Picture"
                class="w-40 h-40 rounded-full shadow-lg shadow-yonder/10 border-2 border-raisin/70"
              />
              <img
                v-else-if="userStore.ME.profile_picture"
                :src="`data:image/png;base64,${userStore.ME.profile_picture}`"
                alt="Profile Picture"
                class="w-40 h-40 rounded-full shadow-lg shadow-yonder/10 border-2 border-raisin/70"
              />

              <IconPlus
                v-else
                class="w-40 h-40 p-8 rounded-full bg-raisin/5 text-raisin/50 hover:bg-raisin/10 cursor-pointer active:bg-raisin/20"
              />
              <div
                v-if="showPicturePopup"
                class="flex justify-center bg-ghost p-2 rounded-xl absolute bottom-0 left-0 overflow-visible"
              >
                <div v-for="picture in pictures" :key="picture.id">
                  <img
                    :src="`data:image/png;base64,${picture.picture}`"
                    alt="Profile Picture"
                    class="w-12 h-12 rounded-full hover:shadow-lg shadow-yonder/10 cursor-pointer"
                    @click="selectedPicture = picture"
                  />
                </div>
                <div>
                  <IconX
                    class="w-12 h-12 p-2 rounded-full bg-raisin/5 text-raisin/50 hover:bg-raisin/10 cursor-pointer active:bg-raisin/20"
                    @click="
                      showPicturePopup = false;
                      selectedPicture = null;
                    "
                  />
                </div>
              </div>
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
                v-model="oldPassword"
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
                v-model="newPassword"
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
                v-model="newPasswordConfirm"
                class="w-full"
              />
            </InputField>
            <LoadingButton
              :disabled="vChangePassword$.$invalid"
              :loading="loadingChangePassword"
              class="mt-4 btn-primary"
              type="submit"
            >
              Update Password
            </LoadingButton>
          </form>
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
