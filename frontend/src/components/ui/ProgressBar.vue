<script setup lang="ts">
// -*- coding: utf-8 -*-
interface Props {
  value: number       // 0–100
  label?: string
  showPercentage?: boolean
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

withDefaults(defineProps<Props>(), {
  label: '',
  showPercentage: true,
  color: 'primary',
})
</script>

<template>
  <div
    class="progress-bar"
    role="progressbar"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label || `进度 ${value}%`"
  >
    <div class="progress-bar__header" v-if="label || showPercentage">
      <span v-if="label" class="progress-bar__label">{{ label }}</span>
      <span v-if="showPercentage" class="progress-bar__percent">{{ value }}%</span>
    </div>
    <div class="progress-bar__track">
      <div
        :class="['progress-bar__fill', `progress-bar__fill--${color}`]"
        :style="{ width: `${Math.min(Math.max(value, 0), 100)}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  @apply w-full;
}

.progress-bar__header {
  @apply flex items-center justify-between mb-1.5;
}

.progress-bar__label {
  @apply text-sm font-medium text-neutral-600;
}

.progress-bar__percent {
  @apply text-sm font-semibold text-neutral-700 tabular-nums;
}

.progress-bar__track {
  @apply w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden;
}

.progress-bar__fill {
  @apply h-full rounded-full transition-all duration-500 ease-out-expo;
  animation: progress 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-bar__fill--primary {
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-700));
}

.progress-bar__fill--success {
  background: linear-gradient(90deg, #34d399, var(--color-success-500));
}

.progress-bar__fill--warning {
  background: linear-gradient(90deg, #fbbf24, var(--color-accent-600));
}

.progress-bar__fill--danger {
  background: linear-gradient(90deg, #f87171, var(--color-danger-500));
}
</style>
