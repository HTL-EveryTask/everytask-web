<script lang="ts" setup>
import { computed, ref } from "vue";

const WEEK_DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const viewedDate = ref(new Date());
const selectedDate = ref(new Date());

const dateTimeLocal = computed(() => {
  return viewedDate.value.toISOString().split("T")[0];
});

const daysInSelectedMonth = computed(() => {
  // if the first day is not a monday, we need to get the previous monday
  const firstDayOfMonth = new Date(
    viewedDate.value.getFullYear(),
    viewedDate.value.getMonth(),
    1
  );

  // if it is 0 make it 7
  const firstDayOfMonthDay =
    firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
  if (firstDayOfMonthDay !== 1) {
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonthDay + 1);
  }

  // get the last day of the month
  const lastDayOfMonth = new Date(
    viewedDate.value.getFullYear(),
    viewedDate.value.getMonth() + 1,
    0
  );

  // make the last day of the month a sunday the next week
  const lastDayOfMonthDay =
    lastDayOfMonth.getDay() === 0 ? 7 : lastDayOfMonth.getDay();
  if (lastDayOfMonthDay !== 7) {
    console.log(lastDayOfMonth);
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 7 - lastDayOfMonthDay);
    console.log(lastDayOfMonth);
  } else {
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 7);
  }

  // return all days in between the first and last day of the month
  const days = [];
  for (
    let i = firstDayOfMonth;
    i <= lastDayOfMonth;
    i.setDate(i.getDate() + 1)
  ) {
    days.push(new Date(i));
  }
  return days;
});

function swipeMonth(n: number = 1) {
  viewedDate.value = new Date(
    viewedDate.value.getFullYear(),
    viewedDate.value.getMonth() + n,
    1
  );
}

const editing = ref(false);
</script>
<template>
  <div class="relative">
    <input
      :value="dateTimeLocal"
      readonly
      type="datetime-local"
      @click="editing = !editing"
      @input="viewedDate = new Date($event.target.value)"
    />
    <div
      v-if="editing"
      :class="{ 'h-0 w-0': !editing, 'h-96 w-96': editing }"
      class="absolute bg-ghost shadow-lg transition-all duration-300 flex"
    >
      <div class="flex flex-col">
        <button class="bg-blue-100 p-4 m-2">Hi</button>
        <button class="bg-blue-100 p-4 m-2">Hi</button>
        <button class="bg-blue-100 p-4 m-2">Hi</button>
      </div>

      <div class="calender bg-blue-200 grow">
        <div class="flex justify-center gap-6">
          <button class="" @click="swipeMonth(-1)">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19l-7-7 7-7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
          <h3>{{ viewedDate.getMonth() }} {{ viewedDate.getFullYear() }}</h3>
          <button class="" @click="swipeMonth(1)">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
        <div>
          <div class="grid grid-cols-7 text-center">
            <div v-for="day in WEEK_DAYS" :key="day">
              {{ day }}
            </div>
          </div>
          <div class="grid grid-cols-7">
            <div
              v-for="day in daysInSelectedMonth"
              :key="day"
              :class="{
                'opacity-50': day.getMonth() !== viewedDate.getMonth(),
                'bg-blue-400':
                  day.getDate() === selectedDate.getDate() &&
                  day.getMonth() === selectedDate.getMonth(),
              }"
              class="hover:cursor-pointer text-sm hover:bg-blue-300 aspect-square flex items-center justify-center"
              @click="selectedDate = day"
            >
              {{ day.getDate() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
