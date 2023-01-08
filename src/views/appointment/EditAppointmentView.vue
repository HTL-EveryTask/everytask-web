<script lang="ts" setup>
import { helpers, maxLength, required } from "@vuelidate/validators";
import { computed, onMounted, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import ModalContainer from "@/components/ModalContainer.vue";
import type { Appointment } from "@/models/Appointment";
import InputField from "@/components/InputField.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { useAppointmentStore } from "@/stores/appointment";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import GroupUserSelector from "@/components/GroupUserSelector.vue";
import SideHeader from "@/components/SideHeader.vue";
import IconSettings from "@/components/icons/IconSettings.vue";
import TagInput from "@/components/TagInput.vue";
import type { Subject } from "@/models/Subject";
import CustomDropDown from "@/components/SubjectSelector.vue";
import { useUntisStore } from "@/stores/untis";
import type { Tag } from "@/models/Tag";

const emit = defineEmits(["close"]);
const props = defineProps<{
  id: number;
}>();

const appointmentStore = useAppointmentStore();

const appointment = ref<Appointment | undefined>();
const subjects = ref<Subject[]>([]);

const title = ref("");
const description = ref("");
const startTime = ref("");
const endTime = ref("");
const assigned = ref<any[]>([]);
const tags = ref<string[]>([]);
const subject = ref<Subject>();

onMounted(async () => {
  watch(
    () => props.id,
    async (id) => {
      if (id) {
        loading.value = true;
        appointment.value = await appointmentStore.getAppointment(id);

        if (!appointment.value) {
          emit("close");
          return;
        }

        title.value = appointment.value?.title || "";
        description.value = appointment.value?.description || "";
        startTime.value = appointment.value?.start_time || "";
        endTime.value = appointment.value?.end_time || "";

        // tags can either be a string[] or Tag[]
        const fetchedTags = appointment.value?.tags;
        if (fetchedTags) {
          if (typeof fetchedTags[0] === "string") {
            tags.value = fetchedTags as string[];
          } else {
            tags.value = (fetchedTags as Tag[]).map((tag) => tag.name);
          }
        }

        const assignedUsers = appointment.value?.assigned_users?.map(
          (user) => ({
            ...user,
            type: "user",
          })
        );

        const assignedGroups = appointment.value?.assigned_groups?.map(
          (group) => ({
            ...group,
            type: "group",
          })
        );

        assigned.value = [...assignedUsers, ...assignedGroups];

        subject.value = appointment.value?.subject;

        loading.value = false;
      } else {
        emit("close");
      }
    },
    { immediate: true }
  );

  await useUntisStore().getSubjects();
  subjects.value = useUntisStore().subjects;
});

const loading = ref(false);
const loadingDelete = ref(false);

let showDeleteModal = ref(false);

const maxTitleLength = computed(() => {
  return appointment.value?.origin === "teams" ? 100 : 32;
});

const rules = {
  title: {
    required,
    maxLength: maxLength(maxTitleLength),
  },
  description: {
    maxLength: maxLength(300),
  },
  startTime: {
    required,
  },
  tags: {
    maxLength: helpers.withMessage(
      "Only a maximum of 5 tags are allowed",
      (value: string[]) => value.length <= 5
    ),
    maxIndividualLength: helpers.withMessage(
      "Only a maximum of 32 characters are allowed",
      (value: string[]) => value.every((tag) => tag.length <= 32)
    ),
  },
};

const v$ = useVuelidate(
  rules,
  { title, description, startTime, tags },
  { $autoDirty: true }
);

async function onSubmit() {
  const assignedUsers = assigned.value
    .filter((item) => item["type"] === "user")
    .map((item) => item["id"]);

  const assignedGroups = assigned.value
    .filter((item) => item["type"] === "group")
    .map((item) => item["id"]);

  const newAppointment: Appointment = {
    id: appointment.value?.id ?? 0,
    title: title.value,
    description: description.value,
    start_time: startTime.value,
    end_time: endTime.value,
    tags: tags.value,
    subject: subject.value,
    origin: "",
    assigned_users: assignedUsers,
    assigned_groups: assignedGroups,
  };

  loading.value = true;
  if (appointment.value) {
    await appointmentStore.updateAppointment(newAppointment);
  }
  loading.value = false;
  await appointmentStore.getAppointments();

  emit("close");
}

async function deleteAppointment() {
  loadingDelete.value = true;
  if (appointment.value) {
    await appointmentStore.deleteAppointment(appointment.value.id);
    await appointmentStore.getAppointments;
  }
  loadingDelete.value = false;
  showDeleteModal.value = false;
  emit("close");
}

// async function updateAppointment() {
//   appointment.value = await appointmentStore.getAppointment(props.id);
// }
</script>

<template>
  <div class="flex flex-col h-full">
    <SideHeader title="Edit Appointment" @close="emit('close')">
      <template v-slot:right>
        <IconSettings class="w-6 h-6" />
      </template>
    </SideHeader>
    <div class="flex-1 overflow-y-auto">
      <Transition mode="out-in" name="fade">
        <div v-if="!loading && appointment" class="relative h-full px-8 py-6">
          <form class="w-full" @submit.prevent="onSubmit">
            <InputField id="title" :validation="v$.title" label="Title">
              <input id="title" v-model="title" class="w-full" type="text" />
              <template v-slot:right>
                <span class="text-gray-500 text-sm">
                  {{ title.length }}/{{ maxTitleLength }}
                </span>
              </template>
            </InputField>

            <section class="my-4">
              <InputField id="tags" :validation="v$.tags" label="Tags">
                <TagInput v-model="tags" :max-chars="20" />
              </InputField>

              <InputField id="subject" label="Subject">
                <CustomDropDown
                  v-model="subject"
                  :subjects="subjects"
                  class="w-[7rem] my-2 input-field"
                  placeholder="Choose"
                />
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

              <div class="flex gap-2">
                <InputField id="due" :validation="v$.startTime" label="Due">
                  <input
                    id="due"
                    v-model="startTime"
                    class="w-full"
                    type="datetime-local"
                  />
                </InputField>
                <InputField id="due" :validation="v$.endTime" label="Due">
                  <input
                    id="due"
                    v-model="endTime"
                    class="w-full"
                    type="datetime-local"
                  />
                </InputField>
              </div>

              <InputField id="assigned" label="Assigned">
                <GroupUserSelector id="assigned" v-model="assigned" />
              </InputField>
            </section>

            <LoadingButton
              :disabled="v$.$invalid"
              :loading="loading"
              class="btn-primary mt-4"
              type="submit"
            >
              Update
            </LoadingButton>
          </form>

          <button
            v-if="appointment"
            class="btn-red"
            type="button"
            @click="showDeleteModal = true"
          >
            Delete Appointment
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
                Are you sure you want to delete this appointment?
              </p>
              <div class="flex w-full gap-4 justify-center">
                <LoadingButton
                  :loading="loadingDelete"
                  class="btn-red"
                  @click="deleteAppointment"
                  >Delete
                </LoadingButton>
                <button
                  class="btn-primary"
                  type="button"
                  @click="showDeleteModal = false"
                >
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
