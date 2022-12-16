<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import IconChevron from "@/components/icons/IconChevron.vue";
import IconCalender from "@/components/icons/IconCalender.vue";
import ModalContainer from "@/components/ModalContainer.vue";

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

const windowWidth = ref(window.innerWidth);
onMounted(() => {
  // add event listener to change the window width
  window.addEventListener("resize", () => {
    windowWidth.value = window.innerWidth;
  });
});

function dateToString(date: Date): string {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
}

function stringToDate(date: string): Date {
  return new Date(date + "T00:00:00.000Z");
}

const today = new Date();

const selectedDate = computed({
  get() {
    return stringToDate(props.modelValue);
  },
  set(value) {
    emit("update:modelValue", dateToString(value));
  },
});

const viewedDate = ref(selectedDate.value);

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
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 7 - lastDayOfMonthDay);
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

function selectDaysFromToday(n: number) {
  selectedDate.value = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + n
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
  return isSameDay(date, today);
}

function isBetweenDates(date: Date, date1: Date, date2: Date) {
  return (
    (date.getTime() > date1.getTime() && date.getTime() < date2.getTime()) ||
    (date.getTime() < date1.getTime() && date.getTime() > date2.getTime())
  );
}

const editing = ref(false);

const isSmallScreen = computed(() => {
  return windowWidth.value < 768;
});
</script>
<template>
  <div>
    <input
      ref="hiddenInput"
      :value="modelValue"
      class="sm:small-screen"
      hidden
      type="date"
    />
    <div @click="editing = !editing">
      <slot />
    </div>
    <component
      :is="isSmallScreen ? ModalContainer : 'div'"
      :show="editing"
      class="bg-white"
      title="Pick a Date"
      @close="editing = false"
    >
      <div
        v-if="editing"
        :class="[$attrs.class, !editing ? 'h-0 w-0' : 'w-[20rem]']"
        class="absolute sm:static bg-white shadow-lg sm:shadow-none transition-all duration-300 flex sm:flex-col rounded-xl"
      >
        <div
          class="flex flex-col mt-12 sm:m-0 text-sm sm:text-md text-raisin/70"
        >
          <div
            class="p-2 flex items-center hover:text-raisin hover:bg-yonder/10 rounded-r-lg cursor-pointer"
            @click="selectDaysFromToday(7)"
          >
            <IconCalender class="w-5 h-5" />
            <span class="ml-1">Next Week</span>
          </div>
          <div
            class="p-2 flex items-center hover:text-raisin hover:bg-yonder/10 rounded-r-lg cursor-pointer"
            @click="selectDaysFromToday(1)"
          >
            <IconCalender class="w-5 h-5" />
            <span class="ml-1">Tomorrow</span>
          </div>
        </div>

        <div class="calender grow rounded-xl">
          <div class="flex justify-center gap-2 h-12 items-center">
            <button class="ml-2" @click="swipeMonth(-1)">
              <IconChevron class="h-4 w-4 transform -rotate-90" />
            </button>
            <span class="text-sm font-bold w-36 text-center">
              {{ MONTHS[viewedDate.getMonth()] }} {{ viewedDate.getFullYear() }}
            </span>
            <button class="mr-2" @click="swipeMonth(1)">
              <IconChevron class="h-4 w-4 transform rotate-90" />
            </button>
          </div>
          <div class="p-2 pt-0">
            <div
              class="grid grid-cols-7 text-center uppercase text-raisin/60 text-xs"
            >
              <span v-for="day in WEEK_DAYS" :key="day">
                {{ day }}
              </span>
            </div>
            <div class="grid grid-cols-7 grid-rows-6">
              <div
                v-for="day in daysInSelectedMonth"
                :key="day.getTime()"
                :class="{
                  'opacity-50': day.getMonth() !== viewedDate.getMonth(),
                  'text-blue-500 font-bold': isSameDay(day, selectedDate),
                }"
                class="relative hover:cursor-pointer text-sm hover:bg-blue-100 rounded-lg aspect-square flex items-center justify-center transition-colors duration-300"
                @click="selectedDate = day"
              >
                <span class="z-20 relative">
                  {{ day.getDate() }}
                </span>
                <div
                  v-if="
                    (isBetweenDates(day, selectedDate, today) ||
                      isToday(day) ||
                      isSameDay(day, selectedDate)) &&
                    !isSameDay(today, selectedDate)
                  "
                  class="z-10 absolute w-full h-full flex items-center justify-center"
                >
                  <div
                    :class="{
                      'bg-green-500/20': selectedDate > new Date(),
                      'bg-red-500/20': selectedDate < new Date(),
                    }"
                    class="w-[85%] h-[85%] rounded-md"
                  />
                </div>
                <div
                  v-if="isSameDay(day, selectedDate) || isToday(day)"
                  :class="{
                    'bg-blue-400': isSameDay(day, selectedDate),
                    'bg-rebecca': isToday(day) && !isSameDay(day, selectedDate),
                  }"
                  class="absolute rounded-full w-[50%] h-[0.20rem] bottom-1 left-1/2 transform -translate-x-1/2"
                ></div>
              </div>
            </div>
            <div class="flex justify-between">
              <button
                class="text-sm hover:text-red-500 transition-colors duration-200"
                @click="selectedDate = today"
                type="button"
              >
                Clear
              </button>
              <button
                class="text-sm hover:text-blue-400 transition-colors duration-200"
                @click="editing = false"
                type="button"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </component>
  </div>
</template>

<style scoped></style>
