<script lang="ts" setup>
import { maxLength, required } from "@vuelidate/validators";
import { computed, onMounted, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import ModalContainer from "@/components/ModalContainer.vue";
import type { Group } from "@/models/Group";
import InputField from "@/components/InputField.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import { useGroupStore } from "@/stores/group";
import IconUser from "@/components/icons/IconUser.vue";
import { useUserStore } from "@/stores/user";
import { useToastStore } from "@/stores/toast";
import IconSettings from "@/components/icons/IconSettings.vue";
import SideHeader from "@/components/SideHeader.vue";

const emit = defineEmits(["close"]);
const props = defineProps<{
  id: number;
}>();

const groupStore = useGroupStore();

const group = ref<Group | undefined>();

const orderedUsers = computed(() => {
  if (!group.value) return [];
  const groupUsersCopy = [...group.value.users];
  const me = groupUsersCopy.find((user) => user.id === useUserStore().ME?.id);
  groupUsersCopy.sort((a, b) => {
    // show my own user first, then admins, then the rest
    if (a.id === me?.id) return -1;
    if (b.id === me?.id) return 1;
    if (a.is_admin && !b.is_admin) return -1;
    if (!a.is_admin && b.is_admin) return 1;
    return 0;
  });
  return groupUsersCopy;
});

const name = ref("");
const description = ref("");

onMounted(async () => {
  watch(
    () => props.id,
    async (id) => {
      if (id) {
        loading.value = true;
        group.value = await groupStore.getGroup(id);

        if (!group.value) {
          emit("close");
          return;
        }
        name.value = group.value?.name || "";
        description.value = group.value?.description || "";
        loading.value = false;
      }
    },
    { immediate: true }
  );
});

const loading = ref(false);
const loadingDelete = ref(false);
const loadingLeave = ref(false);

let showDeleteModal = ref(false);
let showLeaveModal = ref(false);

const rules = {
  name: {
    required,
    maxLength: maxLength(32),
  },
  description: {
    maxLength: maxLength(300),
  },
};

const v$ = useVuelidate(
  rules,
  { name: name, description },
  { $autoDirty: true }
);

async function onSubmit() {
  loading.value = true;
  const newGroup: Group = {
    id: group.value?.id || 0,
    name: name.value,
    description: description.value,
    users: group.value?.users || [],
  };
  if (group.value) {
    await groupStore.updateGroup(newGroup);
  }
  loading.value = false;
  await groupStore.getGroups();

  useToastStore().addToast({
    title: "Group updated",
    message: "The group has been updated",
    type: "success",
  });
  emit("close");
}

async function deleteGroup() {
  loadingDelete.value = true;
  if (group.value) {
    await groupStore.deleteGroup(group.value.id);
    await groupStore.getGroups;
  }
  loadingDelete.value = false;
  showDeleteModal.value = false;
  emit("close");
}

async function leaveGroup() {
  loadingLeave.value = true;
  if (group.value) {
    await groupStore.leaveGroup(group.value.id);
    await groupStore.getGroups;
  }
  loadingLeave.value = false;
  showLeaveModal.value = false;
  emit("close");
}
</script>

<template>
  <div>
    <SideHeader title="Edit Group" @close="emit('close')">
      <template v-slot:right>
        <IconSettings class="w-6 h-6" />
      </template>
    </SideHeader>
    <Transition name="fade">
      <div v-if="!loading" class="relative h-full px-8 py-6">
        <form class="w-full" @submit.prevent="onSubmit">
          <InputField id="name" :validation="v$.name" label="Name">
            <input id="name" v-model="name" class="w-full" type="text" />
            <template v-slot:right>
              <span class="text-gray-500 text-sm"> {{ name.length }}/32 </span>
            </template>
          </InputField>

          <InputField
            id="description"
            :validation="v$.description"
            label="Description"
          >
            <textarea
              id="description"
              v-model="description"
              class="w-full"
              rows="3"
            ></textarea>
            <template v-slot:right>
              <span class="text-gray-500 text-sm">
                {{ description.length }}/300
              </span>
            </template>
          </InputField>

          <h2 class="text-lg font-bold mt-4 mb-2">Members</h2>
          <div class="flex flex-col gap-2">
            <div
              v-for="user in orderedUsers"
              :key="user.id"
              class="flex gap-2 items-center"
            >
              <IconUser class="w-8 h-8" />
              <span class="text-gray-500">{{ user.username }}</span>
              <span v-if="user.is_admin" class="text-gray-500"> (Admin) </span>
            </div>
          </div>

          <LoadingButton
            :disabled="v$.$invalid"
            :loading="loading"
            class="btn-primary mt-4"
            type="submit"
          >
            Update
          </LoadingButton>
        </form>

        <button v-if="group" class="btn-red" @click="showDeleteModal = true">
          Delete Group
        </button>

        <ModalContainer
          :show="showDeleteModal"
          class="bg-ghost"
          headless
          relative
          @close="showDeleteModal = false"
        >
          <div class="flex flex-col items-center">
            <p class="whitespace-nowrap text-center my-2 font-bold px-4">
              Are you sure you want to delete this group?
            </p>
            <div class="flex w-full gap-4 justify-center">
              <LoadingButton
                :loading="loadingDelete"
                class="btn-red"
                @click="deleteGroup"
                >Delete
              </LoadingButton>
              <button class="btn-primary" @click="showDeleteModal = false">
                Cancel
              </button>
            </div>
          </div>
        </ModalContainer>

        <button class="btn-red" @click="showLeaveModal = true">
          Leave Group
        </button>

        <ModalContainer
          :show="showLeaveModal"
          class="bg-ghost"
          headless
          relative
          @close="showLeaveModal = false"
        >
          <div class="flex flex-col items-center">
            <p class="whitespace-nowrap text-center my-2 font-bold px-4">
              Are you sure you want to leave this group?
            </p>
            <div class="flex w-full gap-4 justify-center">
              <LoadingButton
                :loading="loadingLeave"
                class="btn-red"
                @click="leaveGroup"
                >Leave
              </LoadingButton>
              <button class="btn-primary" @click="showDeleteModal = false">
                Cancel
              </button>
            </div>
          </div>
        </ModalContainer>
      </div>
      <div v-else class="h-full flex gap-4 items-center justify-center mt-16">
        <span class="text-gray-500">Loading...</span>
        <IconSpinner class="w-6 h-6 text-raisin/50" />
      </div>
    </Transition>
  </div>
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
