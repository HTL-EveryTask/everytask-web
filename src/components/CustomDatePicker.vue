<script lang="ts" setup>
import { computed, ref } from "vue";

const WEEK_DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const selectedDate = ref(new Date());

const dateTimeLocal = computed(() => {
  return selectedDate.value.toISOString().split("T")[0];
});

const daysInSelectedMonth = computed(() => {
  // if the first day is not a monday, we need to get the previous monday
  const firstDayOfMonth = new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth(),
    1
  );

  console.log(firstDayOfMonth);

  // if it is 0 make it 7
  const firstDayOfMonthDay =
    firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
  console.log(firstDayOfMonthDay);
  if (firstDayOfMonthDay !== 1) {
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonthDay + 1);
    console.log(firstDayOfMonth);
  }
  // return the dates for the next 5 weeks starting from the first day of the month
  const dates = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 7; j++) {
      dates.push(new Date(firstDayOfMonth));
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
    }
  }
  return dates;
});

function swipeMonth(n: number = 1) {
  selectedDate.value = new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth() + n,
    1
  );
}

function printDate(date: Date) {
  console.log(date);
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
      @input="selectedDate = new Date($event.target.value)"
    />
    <div
      :class="{ 'h-0 w-0': !editing, 'h-56 w-96': editing }"
      class="absolute bg-ghost shadow-lg transition-all w-full duration-300"
    >
      <div v-if="editing" class="flex">
        <div class="flex flex-col">
          <button>Hi</button>
          <button>Hi</button>
          <button>Hi</button>
        </div>

        <div class="calender bg-blue-200 w-56">
          <div class="flex">
            <button class="" @click="swipeMonth(-1)">Previous Month</button>
            <h3>
              {{ selectedDate.getMonth() }} {{ selectedDate.getFullYear() }}
            </h3>
            <button class="" @click="swipeMonth(1)">Next Month</button>
          </div>
          <div>
            <div class="grid grid-cols-7">
              <div v-for="day in WEEK_DAYS" :key="day">
                {{ day }}
              </div>
            </div>
            <div class="grid grid-cols-7">
              <div
                v-for="day in daysInSelectedMonth"
                :key="day"
                :class="{
                  'opacity-50': day.getMonth() !== selectedDate.getMonth(),
                }"
                @click="printDate(day)"
              >
                {{ day.getDate() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calender-month > div:nth-child(7n + 1) {
  background-color: red;
}
</style>

@input="selectedDate = new Date($event.target.value)"
