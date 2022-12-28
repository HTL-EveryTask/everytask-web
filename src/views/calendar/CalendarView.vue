<script setup lang="ts">
import IconChevron from "@/components/icons/IconChevron.vue";
import { computed, ref } from "vue";
import DayTimeline from "@/components/DayTimeline.vue";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const viewedDate = ref(new Date());
console.log(viewedDate.value);

const currentWeek = computed(() => {
  const viewedDateCopy = new Date(viewedDate.value);
  const firstDayOfWeek = new Date(
    viewedDateCopy.setDate(
      viewedDateCopy.getDate() - viewedDateCopy.getDay() + 1
    )
  );
  const lastDayOfWeek = new Date(
    viewedDateCopy.setDate(
      viewedDateCopy.getDate() - viewedDateCopy.getDay() + 7
    )
  );
  return [firstDayOfWeek, lastDayOfWeek];
});

function forwardViewByDays(days) {
  console.log(viewedDate.value);
  viewedDate.value = new Date(
    viewedDate.value.setDate(viewedDate.value.getDate() + days)
  );
  console.log(viewedDate.value);
}
</script>

<template>
  <div class="w-full h-full flex flex-col bg-blue-50">
    <div class="header flex">
      <div class="flex items-center">
        <IconChevron
          class="w-5 h-5 cursor-pointer transform -rotate-90"
          @click="forwardViewByDays(-7)"
        />
        <IconChevron
          class="w-5 h-5 cursor-pointer transform rotate-90"
          @click="forwardViewByDays(7)"
        />
      </div>
      <span>
        {{ currentWeek[0].getDate() }}.
        {{ MONTH_NAMES[currentWeek[0].getMonth()] }} -
        {{ currentWeek[1].getDate() }}.
        {{ MONTH_NAMES[currentWeek[1].getMonth()] }}
        {{ currentWeek[1].getFullYear() }}
      </span>
    </div>
    <div class="weekdays flex w-full flex-1 bg-green-500">
      <div class="w-24 flex flex-col">
        <div class="h-12"></div>
        <div class="bg-blue-500/40 flex-1">
          Timeline Labelling here (e.g.- 8:00 AM, 9:30 AM)
        </div>
      </div>
      <div class="flex-1 flex">
        <div
          v-for="(weekday, index) in WEEKDAY_NAMES"
          :key="weekday"
          class="w-[50%] flex flex-col items-center border-r-[1px] border-raisin/40 box-content"
        >
          <div class="h-12 w-full">
            {{ weekday }}
            {{
              new Date(
                new Date(currentWeek[0]).setDate(
                  currentWeek[0].getDate() + index
                )
              ).getDate()
            }}
          </div>
          <div class="bg-blue-100 w-full flex-1 overflow-y-auto">
            <DayTimeline />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
