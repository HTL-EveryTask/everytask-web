<script lang="ts" setup>
import type { Appointment } from "@/models/Appointment";
import { computed } from "vue";
import IconSun from "@/components/icons/IconSun.vue";
import SubjectChip from "@/components/SubjectChip.vue";

const props = defineProps<{
  appointment: Appointment;
}>();

const formatDateTimeString = computed(() => {
  const dateObj = new Date(props.appointment.start_time);
  const monthShort = dateObj.toLocaleString("default", { month: "short" });
  const day = dateObj.getDate();

  return `${monthShort} ${day}`;
});

const dateDayEnding = computed(() => {
  const dateObj = new Date(props.appointment.start_time);
  const day = dateObj.getDate();
  return day % 10 === 1
    ? "st"
    : day % 10 === 2
    ? "nd"
    : day % 10 === 3
    ? "rd"
    : "th";
});
</script>

<template>
  <div class="min-w-[12em] p-2 flex items-center rounded-full">
    <div
      class="flex flex-1 sm:w-[10em] items-baseline flex-wrap gap-x-4 min-w-0 ml-4"
    >
      <span
        class="w-[50%] sm:w-[100%] sm:mr-2 min-w-[12em] sm:min-w-[10em] text-md whitespace-nowrap overflow-hidden overflow-ellipsis"
        >{{ appointment.title }}</span
      >
      <div
        class="flex items-center box-border border-l-[1px] border-raisin/40 sm:border-none text-sm text-gray-500 whitespace-nowrap pl-2 sm:pl-0"
      >
        <span class="flex items-center"
          >{{ formatDateTimeString }}
          <span class="text-[0.8em] relative top-[-0.3em]">
            {{ dateDayEnding }}</span
          ></span
        >
      </div>
    </div>
    <div class="w-16 flex items-center justify-end">
      <SubjectChip
        v-if="appointment?.subject"
        :subject="appointment?.subject"
      />
    </div>
    <div
      class="rounded-full hover:bg-cerulean/10 ml-4 p-1 sm:hidden"
      @click.stop
    >
      <IconSun class="w-6 h-6" />
    </div>
  </div>
</template>

<style scoped></style>
