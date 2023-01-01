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
import GenerateInviteView from "@/views/group/GenerateInviteView.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import AddMemberView from "@/views/group/AddMemberView.vue";
import type { User } from "@/models/User";
import ContextMenu from "@imengyu/vue3-context-menu";
import IconDotsVertical from "@/components/icons/IconDotsVertical.vue";

const emit = defineEmits(["close"]);
const props = defineProps<{
  id: number;
}>();

const groupStore = useGroupStore();

const group = ref<Group | undefined>(
  groupStore.groups.find((g) => g.id === props.id)
);

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
        await groupStore.getGroup(id);
        group.value = groupStore.groups.find((g) => g.id === id);
        console.log(group.value);

        if (!group.value) {
          emit("close");
          useToastStore().addToast({
            title: "Error",
            message: "Group not found",
            type: "error",
          });
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
let showDeleteInviteModal = ref(false);

let showAddUserModal = ref(false);

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

async function updateGroup() {
  group.value = await groupStore.getGroup(props.id);
}

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

function onContextMenu(e: MouseEvent, user: User) {
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      {
        label: "Remove",
        onClick: () => {
          console.log("removing user", user);
        },
        customClass: "hover:bg-yonder/10",
      },
      {
        label: "Make admin",
        onClick: () => {
          console.log("making admin", user);
        },
        customClass: "hover:bg-yonder/10",
      },
    ],
    customClass: "bg-ghost shadow-md shadow-yonder/10",
  });
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

async function deleteInvite() {
  if (group.value) {
    await groupStore.deleteInvite(group.value.id);
    await groupStore.getGroups;
  }
  showDeleteInviteModal.value = false;
  updateGroup();
}
</script>

<template>
  <div>
    <SideHeader title="Edit Group" @close="emit('close')">
      <template v-slot:right>
        <IconSettings class="w-6 h-6" />
      </template>
    </SideHeader>
    <Transition mode="out-in" name="fade">
      <div v-if="!loading && group" class="relative h-full px-8 py-6">
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

          <ModalContainer
            :show="showAddUserModal"
            class="w-[30rem] bg-white"
            effect="shadow"
            title="Add Users"
            @close="showAddUserModal = false"
          >
            <AddMemberView
              :group="group"
              @close="
                showAddUserModal = false;
                updateGroup();
              "
            />
          </ModalContainer>

          <div class="flex gap-2 items-center mb-2">
            <h2 class="text-lg font-bold">Members</h2>
            <button
              class="flex items-center justify-center p-[0.4rem] rounded-md bg-yonder/10 hover:bg-yonder/20 hover:text-yonder/100"
              type="button"
              @click="showAddUserModal = true"
            >
              <IconPlus class="w-5 h-5" />
            </button>
          </div>
          <div class="flex flex-col">
            <div
              v-for="user in orderedUsers"
              :key="user.id"
              class="flex gap-2 items-center hover:bg-yonder/10 p-3 transition-colors duration-200"
              @contextmenu.prevent="onContextMenu($event, user)"
            >
              <IconUser class="w-8 h-8" />
              <span class="text-raisin/80">{{ user.username }}</span>
              <span v-if="user.is_admin" class="text-raisin/40"> (Admin) </span>

              <IconDotsVertical
                class="w-7 h-7 rounded-full p-1 hover:bg-yonder/10 active:bg-yonder/20 text-gray-500 ml-auto"
                @click="onContextMenu($event, user)"
              />
            </div>
          </div>
        </form>

        <h2 class="text-lg font-bold mt-4 mb-2">Invite</h2>
        <GenerateInviteView :group="group" :invite-key="group?.key" />
        <LoadingButton
          :loading="loadingDelete"
          class="bg-red-500/20 text-red-500 hover:bg-red-500/30 p-2 rounded-md"
          @click="showDeleteInviteModal = true"
          >Delete Invite
        </LoadingButton>
        <ModalContainer
          :show="showDeleteInviteModal"
          :title="'Delete Invite'"
          class="bg-ghost w-96"
          headless
          relative
          @close="showDeleteInviteModal = false"
        >
          <div class="p-4">
            <p class="font-bold">
              Are you sure you want to delete this invite?
            </p>
            <p class="italic text-raisin/50">
              (Note:) Afterwards people will not be able to join this group
              anymore.
            </p>
          </div>

          <div class="flex justify-between gap-2">
            <LoadingButton
              :loading="loadingDelete"
              class="bg-red-500/20 text-red-500 hover:bg-red-500/30 p-2 rounded-md"
              @click="deleteInvite"
              >Delete Invite
            </LoadingButton>
            <Button @click="showDeleteInviteModal = false">Cancel</Button>
          </div>
        </ModalContainer>

        <LoadingButton
          :disabled="v$.$invalid"
          :loading="loading"
          class="btn-primary mt-4"
          type="submit"
          @click="onSubmit"
        >
          Update
        </LoadingButton>

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
              <button class="btn-primary" @click="showLeaveModal = false">
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
