<script setup lang="ts">
// -*- coding: utf-8 -*-
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
  type: 'button',
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'app-btn',
      `app-btn--${variant}`,
      `app-btn--${size}`,
      {
        'app-btn--block': block,
        'app-btn--loading': loading,
      },
    ]"
    :aria-busy="loading"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="app-btn__spinner"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="31.4 31.4"
        class="animate-spin origin-center"
      />
    </svg>
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.app-btn {
  @apply relative inline-flex items-center justify-center gap-2
         font-sans font-semibold
         rounded-[10px]
         cursor-pointer select-none
         transition-all duration-150 ease-out-expo;
  outline: none;
}

.app-btn:focus-visible {
  @apply ring-2 ring-primary-400 ring-offset-2;
}

.app-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Sizes */
.app-btn--sm {
  @apply px-3 py-1.5 text-sm;
  min-height: 32px;
}
.app-btn--md {
  @apply px-5 py-2.5 text-base;
  min-height: 40px;
}
.app-btn--lg {
  @apply px-7 py-3 text-lg;
  min-height: 48px;
}

/* Variants */
.app-btn--primary {
  @apply bg-primary-700 text-white;
  box-shadow: 0 2px 8px rgba(67, 56, 202, 0.25);
}
.app-btn--primary:hover:not(:disabled) {
  @apply bg-primary-600;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(67, 56, 202, 0.3);
}
.app-btn--primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(67, 56, 202, 0.2);
}

.app-btn--secondary {
  @apply bg-white text-primary-700 border-2 border-primary-200;
}
.app-btn--secondary:hover:not(:disabled) {
  @apply bg-primary-50 border-primary-300;
  transform: translateY(-1px);
}

.app-btn--ghost {
  @apply bg-transparent text-neutral-600;
}
.app-btn--ghost:hover:not(:disabled) {
  @apply bg-neutral-100 text-neutral-800;
}

.app-btn--danger {
  @apply bg-danger-500 text-white;
}
.app-btn--danger:hover:not(:disabled) {
  @apply bg-danger-600;
  transform: translateY(-1px);
}

.app-btn--block {
  @apply w-full;
}

/* Loading */
.app-btn__spinner {
  @apply absolute w-5 h-5;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>
