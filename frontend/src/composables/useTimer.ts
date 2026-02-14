// -*- coding: utf-8 -*-
import { ref, onUnmounted, computed } from 'vue'

/**
 * 计时器组合式函数
 */
export function useTimer() {
  const elapsed = ref(0)
  let intervalId: ReturnType<typeof setInterval> | null = null
  let startTs = 0

  const formatted = computed(() => {
    const minutes = Math.floor(elapsed.value / 60)
    const seconds = elapsed.value % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })

  function start() {
    if (intervalId) return
    startTs = Date.now()
    intervalId = setInterval(() => {
      elapsed.value = Math.floor((Date.now() - startTs) / 1000)
    }, 1000)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset() {
    stop()
    elapsed.value = 0
  }

  onUnmounted(() => {
    stop()
  })

  return {
    elapsed,
    formatted,
    start,
    stop,
    reset,
  }
}
