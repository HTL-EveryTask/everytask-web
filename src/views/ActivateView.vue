<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useAuthenticateStore } from "@/stores/auth";
import IconSpinner from "@/components/icons/IconSpinner.vue";

const props = defineProps<{
  code: string;
}>();

const loading = ref(true);
const error = ref();

onMounted(async () => {
  try {
    const response = await useAuthenticateStore().activateAccount(props.code);
    if (!response.ok) {
      error.value = await response.json().then((data) => data.message);
    }
  } catch (e) {
    error.value = "Connection error";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl"
    >
      <IconSpinner v-if="loading" class="w-16 h-16 text-raisin/50" />
      <div v-else-if="error" class="text-center">
        <p class="text-raisin/50">
          {{ error }}
        </p>
      </div>
      <div v-else class="text-center">
        <p class="text-raisin/50">
          Your account has been activated. You can now log in.
        </p>
        <router-link :to="{ name: 'login' }">Log in</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
class=" btn-primary mt-4 "
