<script lang="ts" setup>
import { ref } from "vue";
import type { Group } from "@/models/Group";
import { useGroupStore } from "@/stores/group";
import IconCopy from "@/components/icons/IconCopy.vue";
import { useToastStore } from "@/stores/toast";

const loading = ref(false);
const inviteLink = ref("");

const props = defineProps<{
  group: Group;
}>();

async function requestInviteLink() {
  loading.value = true;
  const response = await useGroupStore().requestInvite(props.group.id);
  inviteLink.value = await response.json().then((data) => data.key);
  inviteLink.value = `${window.location.origin}/invite/?code=${inviteLink.value}`;
  loading.value = false;
}

function copyInviteLink() {
  navigator.clipboard.writeText(inviteLink.value);
  useToastStore().addToast({
    title: "Invite link copied",
    type: "info",
    message: "",
  });
}
</script>

<template>
  <div>
    <button
      class="btn-primary block mt-4"
      type="button"
      @click="requestInviteLink"
    >
      Generate Invite Link
    </button>

    <div class="flex items-center w-full input-field my-4">
      <input :value="inviteLink" class="flex-1" disabled type="text" />
      <button
        class="ml-2 p-2 rounded-xl hover:bg-gray-200"
        type="button"
        title="Copy"
        :disabled="!inviteLink"
        @click="copyInviteLink"
      >
        <IconCopy class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

.side-enter-active,
.side-leave-active {
  transition: all 0.4s ease-in-out;
}

.side-enter-from,
.side-leave-to {
  opacity: 0;
  min-width: 0;
  width: 0;
}

.side-leave-active {
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
