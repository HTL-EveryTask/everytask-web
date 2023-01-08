<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import router from "@/router";
import AddAppointmentPopUp from "@/components/AddAppointmentPopUp.vue";
import { useAppointmentStore } from "@/stores/appointment";
import SideViewContainer from "@/components/SideViewContainer.vue";
import AppointmentBoard from "@/components/AppointmentBoard.vue";
import { useToastStore } from "@/stores/toast";
import { useGroupStore } from "@/stores/group";

const appointmentStore = useAppointmentStore();
const groupStore = useGroupStore();
const loading = ref(false);

const type = ref(router.currentRoute.value.params.type);
const groupId = ref();

const orderedAppointments = computed(() => {
  const appointmentCopy = [...appointmentStore.appointments];
  return appointmentCopy.sort((a, b) => {
    const aDate = new Date(a.start_time);
    const bDate = new Date(b.start_time);
    return aDate.getTime() - bDate.getTime();
  });
});

// const filteredGroups = computed(() => {
//   return groupStore.groups.filter(
//     (storeGroups) =>
//       orderedAppointments.value.filter((appointment) =>
//         appointment.assigned_groups.find((g) => g.id === storeGroups.id)
//       ).length
//   );
// });

onMounted(async () => {
  groupStore.getGroups();
  if (!appointmentStore.appointments.length) {
    loading.value = true;
  }
  try {
    await appointmentStore.getAppointments();
  } catch {
    useToastStore().addToast({
      title: "Error",
      message: "Error while loading appointments",
      type: "error",
    });
  } finally {
    loading.value = false;
  }

  watch(
    () => router.currentRoute.value.params.type,
    (newType) => {
      type.value = newType;
    }
  );

  watch(
    () => groupId.value,
    (newGroupId) => {
      groupId.value = newGroupId;
      // scroll into view
      const element = document.getElementById(newGroupId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  );
});
</script>

<template>
  <div class="flex h-full relative">
    <main class="flex-1 flex flex-col relative">
      <div class="flex-1 overflow-y-auto">
        <div class="mx-4 sm:m-1">
          <AppointmentBoard
            :appointments="orderedAppointments"
            :loading="loading"
            title="All Appointments"
          />
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 px-8 sm:px-2">
        <AddAppointmentPopUp
          class="my-4 max-w-[52em] sm:w-full rounded-3xl text-raisin mx-auto shadow-lg shadow-yonder/10 transition-colors bg-ghost"
          expandedClass="bg-white/100"
          @expandFull="router.push({ name: 'appointments' })"
        />
      </div>
    </main>

    <SideViewContainer
      :show="$route.name === 'showAppointment'"
      title="Edit appointment"
      @close="router.push({ name: 'appointments' })"
    >
      <RouterView @close="router.push({ name: 'appointments' })" />
    </SideViewContainer>
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped></style>
