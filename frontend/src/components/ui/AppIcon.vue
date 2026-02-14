<script setup lang="ts">
// -*- coding: utf-8 -*-
/**
 * SVG Icon 包装组件
 * 使用 lucide-vue-next 图标库，禁止 emoji
 */
import type { Component } from 'vue'

interface Props {
  icon: Component
  size?: number
  strokeWidth?: number
  color?: string
}

withDefaults(defineProps<Props>(), {
  size: 20,
  strokeWidth: 2,
  color: 'currentColor',
})
</script>

<template>
  <component
    :is="icon"
    :size="size"
    :stroke-width="strokeWidth"
    :color="color"
    class="app-icon"
    aria-hidden="true"
  />
</template>

<style scoped>
.app-icon {
  @apply inline-block flex-shrink-0;
  transition: color var(--duration-fast) var(--ease-out-expo);
}
</style>
