import { onMounted, onUnmounted } from "vue";

export function useClickOutside(elementRef: any, callback: () => void) {
  const handler = (event: any) => {
    if (!elementRef.value.contains(event.target)) {
      callback();
    }
  };
  onMounted(() => {
    document.addEventListener("click", handler);
  });
  onUnmounted(() => {
    document.removeEventListener("click", handler);
  });
}
