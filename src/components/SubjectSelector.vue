<script lang="ts" setup>
import type { Subject } from "@/models/Subject";
import { computed, ref } from "vue";
import SubjectChip from "@/components/SubjectChip.vue";
import IconChevron from "@/components/icons/IconChevron.vue";
import IconX from "@/components/icons/IconX.vue";

const props = defineProps<{
  subjects: Subject[];
  placeholder?: string;
  modelValue: Subject | undefined;
}>();

const emit = defineEmits(["update:modelValue"]);

const search = ref("");
const searchInput = ref();

const expandedContainer = ref();

const selectedSubject = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const expanded = ref(false);

function selectSubject(subject: Subject) {
  selectedSubject.value = subject;
  console.log(selectedSubject.value);
}

const isEnoughSpace = computed(() => {
  if (!expandedContainer.value) return true;
  const rect = expandedContainer.value.getBoundingClientRect();
  // convert 20rem to px
  const height =
    20 * parseFloat(getComputedStyle(document.documentElement).fontSize);

  return rect.top + height < window.innerHeight;
});

function beforeTaskLeave(el: any) {
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
  el.style.left = `${el.offsetLeft - parseFloat(marginLeft)}px`;
  el.style.top = `${el.offsetTop - parseFloat(marginTop)}px`;
  el.style.width = width;
  el.style.height = height;
}
</script>

<template>
  <div>
    <div
      v-if="expanded"
      class="fixed inset-0 flex items-center justify-center"
      @click="expanded = false"
    />

    <div :class="$attrs.class" class="relative">
      <div class="w-full flex items-center" @click.stop="expanded = !expanded">
        <div class="flex-1">
          <div v-if="selectedSubject" class="pb-1">
            <SubjectChip :subject="selectedSubject" />
          </div>
          <span v-else class="mt-1 overflow-x-auto overflow-ellipsis">
            {{ placeholder || "Subject" }}
          </span>
        </div>
        <IconChevron
          :class="expanded ? 'transform rotate-180' : ''"
          class="w-4 h-4 mx-2 transition-transform duration-300"
        />
      </div>
      <Transition name="side">
        <div
          v-if="expanded"
          ref="expandedContainer"
          :class="{
            'top-full': isEnoughSpace,
            'bottom-full': !isEnoughSpace,
          }"
          class="absolute z-20 h-[20rem] items-end w-full p-1 rounded-lg bg-white shadow-md shadow-yonder/10 flex flex-col mb-2"
        >
          <div
            class="relative w-full rounded-t-lg p-1 flex text-sm flex items-center"
          >
            <input
              ref="searchInput"
              v-model="search"
              class="px-1 w-full border-b-[1px] border-raisin/40"
              placeholder="Search"
              type="text"
            />
            <button
              class="absolute text-raisin/50 flex items-center justify-center p-1 rounded-sm right-1 hover:text-raisin/70"
              type="button"
              @click="
                selectedSubject = undefined;
                search = '';
              "
            >
              <IconX class="w-4 h-4" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto w-full">
            <div class="flex flex-col gap-y-2 items-end px-2 mt-2">
              <TransitionGroup name="list" @before-leave="beforeTaskLeave">
                <SubjectChip
                  v-for="subject in props.subjects
                    .filter(
                      (s) =>
                        s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.long_name
                          ?.toLowerCase()
                          .includes(search.toLowerCase())
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))"
                  :key="subject.id"
                  :subject="subject"
                  class="w-full cursor-pointer"
                  @click="selectSubject(subject)"
                />
              </TransitionGroup>
            </div>
          </div>
        </div>
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
  min-height: 0;
  height: 0;
}

.side-leave-active {
  overflow: hidden;
}
</style>
