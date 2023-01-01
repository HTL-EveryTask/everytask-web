<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import type { Group } from "@/models/Group";
import { useGroupStore } from "@/stores/group";
import CopyableField from "@/components/CopyableField.vue";
import LoadingButton from "@/components/LoadingButton.vue";

const props = defineProps<{
  group: Group;
  inviteKey?: string;
}>();

const loading = ref(false);

const inviteLink = ref(
  props.inviteKey ? `${window.location.origin}/join/${props.inviteKey}` : ""
);

onMounted(async () => {
  // watch for changes in the invite key prop
  watch(
    () => props.inviteKey,
    async (inviteKey) => {
      if (!inviteKey) {
        inviteLink.value = "";
      }
    }
  );
});

async function requestInviteLink() {
  loading.value = true;
  const response = await useGroupStore().requestInvite(props.group.id);
  inviteLink.value = await response.json().then((data) => data.key);
  inviteLink.value = `${window.location.origin}/invite/?code=${inviteLink.value}`;
  loading.value = false;
}
</script>

<template>
  <div>
    <LoadingButton
      class="btn-primary block"
      type="button"
      @click="requestInviteLink"
      v-if="!inviteLink"
      :loading="loading"
    >
      Generate Invite Link
    </LoadingButton>

    <CopyableField
      v-model="inviteLink"
      class="mt-4 input-field"
      message="Invite link copied to clipboard"
    >
      <input
        :disabled="!inviteLink"
        :value="inviteLink"
        placeholder="Your invite link will appear here"
        type="text"
        readonly
      />
    </CopyableField>
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
