
<script setup lang="ts">
const { toasts, remove } = useToast()

const styles = {
  success: {
    icon: '✓',
    color: '#16a34a',
    background: '#f0fdf4',
  },
  error: {
    icon: '✕',
    color: '#dc2626',
    background: '#fef2f2',
  },
  warning: {
    icon: '!',
    color: '#d97706',
    background: '#fffbeb',
  },
  info: {
    icon: 'i',
    color: '#2563eb',
    background: '#eff6ff',
  },
}
</script>

<template>
  <div
    class="fixed right-6 top-6 z-[9999] flex w-[calc(100vw-3rem)] flex-col gap-3 sm:w-96"
    aria-live="polite"
    aria-atomic="false"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-3 rounded-xl border border-solid p-4 shadow-lg"
        :style="{
          '--toast-color': styles[toast.type].color,
          '--toast-background': styles[toast.type].background,
          borderColor: `color-mix(in srgb, ${styles[toast.type].color} 20%, white)`,
          backgroundColor: styles[toast.type].background,
        }"
        role="status"
      >

            <span class="font-bold text-sm"
            :style="{ color: styles[toast.type].color }">{{ styles[toast.type].icon }}</span>



        <p class="min-w-0 flex-1 wrap-break-word text-sm text-stone-800">
          {{ toast.message }}
        </p>

        <button
          class="shrink-0 cursor-pointer border-0 bg-transparent text-2xl leading-none text-stone-500 transition-colors hover:text-stone-900"
          type="button"
          aria-label="Fermer la notification"
          @click="remove(toast.id)"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}

.toast-leave-active {
  position: absolute;
  right: 0;
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition: none;
  }
}
</style>
