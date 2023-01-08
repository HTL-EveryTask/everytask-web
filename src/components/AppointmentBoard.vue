<script lang="ts" setup>
import IconSpinner from "@/components/icons/IconSpinner.vue";
import AppointmentCard from "@/components/AppointmentCard.vue";
import router from "@/router";
import { computed, ref } from "vue";
import type { Appointment } from "@/models/Appointment";
import IconSearch from "@/components/icons/IconSearch.vue";

const props = defineProps<{
  appointments: Appointment[];
  title: string;
  loading?: boolean;
}>();

const error = ref("");
const query = ref("");

const filteredAppointments = computed(() => {
  return props.appointments.filter((appointment) => {
    return (
      appointment.title.toLowerCase().includes(query.value.toLowerCase()) ||
      appointment.description.toLowerCase().includes(query.value.toLowerCase())
    );
  });
});

function beforeAppointmentLeave(el: any) {
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
  el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`;
  el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`;
  el.style.width = width;
  el.style.height = height;
}
</script>

<template>
  <div class="main-board flex flex-col">
    <header class="text-3xl p-8 border-b-2 border-yonder/60 flex items-center">
      <h1 class="font-semibold">{{ title }}</h1>
      <div
        class="h-10 rounded-full flex bg-white items-center p-4 mx-8 sm:mx-2 border-[1px] border-yonder/20"
      >
        <input
          type="text"
          class="text-sm w-full"
          placeholder="Search..."
          v-model="query"
        />
        <div class="ml-auto">
          <IconSearch class="h-4 w-4" />
        </div>
      </div>
    </header>
    <div class="p-8 sm:p-4 sm:px-2 overflow-y-auto w-full h-full">
      <Transition appear mode="out-in" name="fade">
        <div v-if="loading" class="flex justify-center items-center h-full">
          <IconSpinner />
        </div>
        <div v-else-if="error" class="flex justify-center items-center h-full">
          <span>{{ error }}</span>
        </div>
        <div
          v-else-if="appointments.length === 0"
          class="flex justify-center items-center h-full"
        >
          <span>No appointments</span>
        </div>
        <TransitionGroup
          v-else
          appear
          class="flex flex-col gap-4"
          name="list"
          tag="div"
          @before-leave="beforeAppointmentLeave"
        >
          <AppointmentCard
            v-for="(appointment, index) in filteredAppointments"
            :key="appointment.id"
            :class="[
              Number(router.currentRoute.value.params.id) === appointment.id
                ? 'border-cerulean/50 border-2'
                : 'border-transparent border-2',
            ]"
            :data-index="index"
            :appointment="appointment"
            class="bg-white shadow-md shadow-yonder/10 hover:bg-blue-50 hover:shadow-yonder/20 transition-all duration-300"
            @click="
              Number(router.currentRoute.value.params.id) === appointment.id
                ? router.push({ name: 'appointments' })
                : router.replace({
                    name: 'showAppointment',
                    params: { id: appointment.id },
                  })
            "
          />
        </TransitionGroup>
      </Transition>
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
