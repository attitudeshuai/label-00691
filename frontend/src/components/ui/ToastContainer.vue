<script setup lang="ts">
// -*- coding: utf-8 -*-
import { useToast } from '@/composables/useToast'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-vue-next'

const { toasts, remove } = useToast()

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}
</script>

<template>
  <Teleport to="body">
    <div
      class="toast-container"
      aria-live="polite"
      aria-label="通知消息"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast-item', `toast-item--${toast.type}`]"
          role="alert"
        >
          <component
            :is="iconMap[toast.type]"
            class="toast-item__icon"
            :size="20"
            aria-hidden="true"
          />
          <span class="toast-item__text">{{ toast.text }}</span>
          <button
            class="toast-item__close"
            @click="remove(toast.id)"
            aria-label="关闭通知"
          >
            <X :size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  @apply fixed top-4 right-4 z-50 flex flex-col gap-2;
  max-width: 400px;
}

.toast-item {
  @apply flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
         text-sm font-medium backdrop-blur-sm
         border;
  animation: slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-item--success {
  @apply bg-success-50 text-success-600 border-success-500/20;
}

.toast-item--error {
  @apply bg-danger-50 text-danger-600 border-danger-500/20;
}

.toast-item--warning {
  @apply bg-warning-50 text-warning-600 border-warning-500/20;
}

.toast-item--info {
  @apply bg-info-50 text-info-600 border-info-500/20;
}

.toast-item__icon {
  @apply flex-shrink-0;
}

.toast-item__text {
  @apply flex-1;
}

.toast-item__close {
  @apply flex-shrink-0 p-0.5 rounded-md opacity-60
         hover:opacity-100 transition-opacity cursor-pointer;
  background: transparent;
  border: none;
  color: inherit;
}

/* Transition */
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}
</style>
