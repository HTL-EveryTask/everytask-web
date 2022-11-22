<script lang="ts" setup>
import { computed, ref } from "vue";
import IconChevron from "@/components/icons/IconChevron.vue";

const WEEK_DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = [
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

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

function dateToString(date: Date): string {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
}

function stringToDate(date: string): Date {
  return new Date(date);
}

const selectedDate = computed({
  get() {
    return stringToDate(props.modelValue);
  },
  set(value) {
    console.log("set", value);
    console.log("to string: ", dateToString(value));
    emit("update:modelValue", dateToString(value));
  },
});

const viewedDate = ref(new Date());

// const selectedDate = ref(new Date());
// convert date object to string

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

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isToday(date: Date) {
  return isSameDay(date, new Date());
}

function isBetweenDates(date: Date, date1: Date, date2: Date) {
  return (
    (date.getTime() > date1.getTime() && date.getTime() < date2.getTime()) ||
    (date.getTime() < date1.getTime() && date.getTime() > date2.getTime())
  );
}

const editing = ref(true);

function select(date: Date) {
  console.log("clicked day: ", date);
  // const dateCopy = new Date(date);
  // decrement the copy by one day
  selectedDate.value = date;
  console.log("set date: ", selectedDate.value);
}
</script>
<template>
  <div class="relative">
    <input :value="modelValue" class="" type="date" />
    <div @click="editing = !editing">
      <slot />
    </div>
    <div
      v-if="editing"
      :class="{ 'h-0 w-0': !editing, 'w-96': editing }"
      class="absolute bg-ghost shadow-lg transition-all duration-300 flex rounded-xl"
    >
      <div class="flex flex-col mt-12">
        <button class="bg-blue-100 p-4 m-2">Hi</button>
        <button class="bg-blue-100 p-4 m-2">Hi</button>
        <button class="bg-blue-100 p-4 m-2">Hi</button>
      </div>

      <div class="calender grow rounded-xl">
        <div class="flex justify-center gap-6 h-14 items-center">
          <button class="" @click="swipeMonth(-1)">
            <IconChevron class="h-4 w-4 transform -rotate-90" />
          </button>
          <span class="text-lg font-bold w-36 text-center">
            {{ MONTHS[viewedDate.getMonth()] }} {{ viewedDate.getFullYear() }}
          </span>
          <button class="" @click="swipeMonth(1)">
            <IconChevron class="h-4 w-4 transform rotate-90" />
          </button>
        </div>
        <div class="p-2 pt-0">
          <div class="grid grid-cols-7 text-center uppercase">
            <span v-for="day in WEEK_DAYS" :key="day">
              {{ day }}
            </span>
          </div>
          <div class="grid grid-cols-7 grid-rows-6">
            <div
              v-for="day in daysInSelectedMonth"
              :key="day"
              :class="{
                'opacity-50': day.getMonth() !== viewedDate.getMonth(),
              }"
              class="relative hover:cursor-pointer text-sm hover:bg-blue-100 aspect-square flex items-center justify-center"
              @click="select(day)"
            >
              <span>
                {{ day.getDate() }}
              </span>
              <div
                v-if="isSameDay(day, selectedDate) || isToday(day)"
                :class="{
                  'bg-blue-400': isSameDay(day, selectedDate),
                  'bg-rebecca/50': isToday(day),
                }"
                class="absolute w-5 h-[0.20rem] bottom-2 left-1/2 transform -translate-x-1/2"
              ></div>
              <div
                v-if="
                  (isBetweenDates(day, selectedDate, new Date()) &&
                    selectedDate >= new Date()) ||
                  (isSameDay(day, selectedDate) &&
                    !isToday(selectedDate) &&
                    selectedDate > viewedDate)
                "
                class="absolute w-full h-full flex items-center justify-center"
              >
                <div class="bg-green-500/20 p-4 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
