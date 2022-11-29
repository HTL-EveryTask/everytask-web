<script lang="ts" setup>
import { onMounted, ref } from "vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import { useGroupStore } from "@/stores/group";

const props = defineProps<{
  code: string;
}>();

const loading = ref(true);
const error = ref();

onMounted(async () => {
  try {
    const response = await useGroupStore().acceptInvite(props.code);
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
        <p class="text-raisin/50">You have successfully joined the group!</p>
        <a class="text-raisin/50 underline hover:text-raisin/100" href="/public"
          >Return to home</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
class=" btn-primary mt-4 "
