// -*- coding: utf-8 -*-
import { ref } from 'vue'
import type { ToastMessage, ToastType } from '@/types'

const toasts = ref<ToastMessage[]>([])
let toastId = 0

/**
 * 全局 Toast 通知
 */
export function useToast() {
  function show(text: string, type: ToastType = 'info', duration = 3000) {
    const id = ++toastId
    toasts.value.push({ id, type, text, duration })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      toasts.value.splice(idx, 1)
    }
  }

  function success(text: string, duration?: number) {
    show(text, 'success', duration)
  }

  function error(text: string, duration?: number) {
    show(text, 'error', duration)
  }

  function warning(text: string, duration?: number) {
    show(text, 'warning', duration)
  }

  function info(text: string, duration?: number) {
    show(text, 'info', duration)
  }

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
  }
}
