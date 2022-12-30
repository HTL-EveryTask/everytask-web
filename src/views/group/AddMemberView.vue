<script lang="ts" setup>
import type { Group } from "@/models/Group";
import MemberSelector from "@/components/MemberSelector.vue";
import { computed, ref } from "vue";
import { useGroupStore } from "@/stores/group";
import type { User } from "@/models/User";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import LoadingButton from "@/components/LoadingButton.vue";
import { useToastStore } from "@/stores/toast";

const props = defineProps<{
  group: Group;
}>();
const emit = defineEmits(["close"]);

const selectedUsers = ref<User[]>([]);
const loading = ref(false);

const pool = computed(() => {
  return useGroupStore()
    .getAllUsers()
    .filter((user) => !props.group.users.find((u) => u.id === user.id));
});

async function addUsers() {
  loading.value = true;
  try {
    const response = await useGroupStore().addUsersToGroup(
      props.group.id,
      selectedUsers.value.map((user) => user.id)
    );

    if (response.ok) {
      useToastStore().addToast({
        title: "Success",
        message: "Users added to group",
        type: "success",
      });
      emit("close");
    } else {
      useToastStore().addToast({
        title: "Error",
        message: "Failed to add users to group",
        type: "error",
      });
    }
  } catch (error) {
    useToastStore().addToast({
      title: "Error",
      message: "Failed to add users to the group",
      type: "error",
    });
  } finally {
    loading.value = false;
    selectedUsers.value = [];

    emit("close");
  }
}

const rules = {
  selectedUsers: {
    required,
  },
};

const $v = useVuelidate(rules, { selectedUsers });
</script>

<template>
  <form class="flex flex-col px-4" @submit.prevent="addUsers">
    <MemberSelector
      v-model="selectedUsers"
      :pool="pool"
      class="min-h-[30rem]"
    />
    <div class="flex justify-between">
      <button class="btn btn-red" type="button" @click="emit('close')">
        Close
      </button>
      <LoadingButton
        :disabled="$v.$invalid || loading"
        :loading="loading"
        class="btn btn-primary"
        type="submit"
      >
        Add Users
      </LoadingButton>
    </div>
  </form>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
