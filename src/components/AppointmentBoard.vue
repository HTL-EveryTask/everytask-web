<script lang="ts" setup>
import { computed, ref } from "vue";
import type { Appointment } from "@/models/Appointment";

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

const month = new Date().getMonth();
const year = new Date().getFullYear();
const masks = {
  weekdays: "WWW",
};

const attributes = computed(() => {
  return props.appointments.map((appointment) => {
    return {
      key: appointment.id,
      popover: {
        label: appointment.title,
        visibility: "focus",
      },
      customData: {
        title: appointment.title,
        class: "bg-red-600 text-white",
        foreColor: appointment.subject?.fore_color,
        backColor: appointment.subject?.back_color,
      },
      dates: new Date(appointment.start_time),
    };
  });
});
</script>

<template>
  <div class="main-board flex flex-col h-auto">
    <v-calendar
      :attributes="attributes"
      :masks="masks"
      class="custom-calendar max-w-full"
      disable-page-swipe
      is-expanded
    >
      <template v-slot:day-content="{ day, attributes, dayEvents }">
        <div class="flex flex-col h-full z-10 overflow-hidden">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="attr in attributes"
              :key="attr.key"
              :class="attr.customData.class"
              :style="{
                backgroundColor: attr.customData.backColor,
                color: attr.customData.foreColor,
              }"
              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1 bg-blue-500 text-white"
            >
              {{ attr.customData.title }}
            </p>
          </div>
        </div>
      </template>
      <template v-slot:day-popover>
        <div>Using my own content now</div>
      </template>
    </v-calendar>
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

::-webkit-scrollbar {
  width: 0px;
}

::-webkit-scrollbar-track {
  display: none;
}

:deep(.custom-calendar.vc-container) {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 90px;
  --day-height: 90px;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;
  border-radius: 0;
  width: 100%;
  @apply rounded-xl;

  & .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
    @apply rounded-xl;
  }

  & .vc-weeks {
    padding: 0;
  }

  & .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }

  & .vc-day {
    padding: 0 5px 3px 5px;
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    @apply sm:min-w-[20px];
    background-color: white;

    &.weekday-1,
    &.weekday-7 {
      background-color: #eff8ff;
    }

    &:not(.on-bottom) {
      border-bottom: var(--day-border);

      &.weekday-1 {
        border-bottom: var(--day-border-highlight);
      }
    }

    &:not(.on-right) {
      border-right: var(--day-border);
    }
  }

  & .vc-day-dots {
    margin-bottom: 5px;
  }
}
</style>
