<script setup lang="ts">
// -*- coding: utf-8 -*-
import { ref } from 'vue'
import { Upload, FileText, BookOpen, Sparkles } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import { parseWordDocument } from '@/utils/docParser'
import { useQuizStore } from '@/stores/quiz'
import { useToast } from '@/composables/useToast'
import { mockQuestions } from '@/data/mockQuestions'

const store = useQuizStore()
const toast = useToast()
const isDragging = ref(false)
const isLoading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

async function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    await processFile(files[0])
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    await processFile(input.files[0])
    input.value = ''
  }
}

async function processFile(file: File) {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ]

  if (!validTypes.includes(file.type) && !file.name.match(/\.docx?$/i)) {
    toast.error('请上传 Word 文档（.doc 或 .docx 格式）')
    return
  }

  isLoading.value = true
  try {
    const questions = await parseWordDocument(file)
    if (questions.length === 0) {
      toast.warning('未能从文档中解析到题目，请检查文档格式')
      return
    }
    const title = file.name.replace(/\.docx?$/i, '')
    store.loadQuestions(questions, title)
    toast.success(`成功解析 ${questions.length} 道题目，开始答题！`)
  } catch (err) {
    console.error('文档解析失败:', err)
    toast.error('文档解析失败，请检查文件格式是否正确')
  } finally {
    isLoading.value = false
  }
}

function loadMockQuestions() {
  store.loadQuestions(mockQuestions, '计算机基础知识测验')
  toast.success('已加载示例题库（10 道题），开始答题！')
}
</script>

<template>
  <div class="uploader animate-fade-in">
    <!-- Header -->
    <div class="uploader__header">
      <div class="uploader__logo">
        <BookOpen :size="36" class="text-primary-600" />
      </div>
      <h1 class="uploader__title">智慧答题</h1>
      <p class="uploader__subtitle">
        上传 Word 文档，即刻开启答题之旅
      </p>
    </div>

    <!-- Drop Zone -->
    <div
      :class="[
        'uploader__dropzone',
        { 'uploader__dropzone--active': isDragging },
        { 'uploader__dropzone--loading': isLoading },
      ]"
      role="button"
      tabindex="0"
      :aria-label="isLoading ? '正在解析文档...' : '点击或拖拽上传 Word 文档'"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="triggerFileInput"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        class="sr-only"
        aria-hidden="true"
        @change="handleFileChange"
      />

      <div v-if="isLoading" class="uploader__loading">
        <svg class="uploader__spinner" viewBox="0 0 40 40" aria-hidden="true">
          <circle
            cx="20" cy="20" r="16"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-dasharray="50 50"
            stroke-linecap="round"
          />
        </svg>
        <span class="text-neutral-500 mt-3 font-medium">正在解析文档...</span>
      </div>

      <div v-else class="uploader__content">
        <div class="uploader__icon-wrapper">
          <Upload :size="32" class="text-primary-500" />
        </div>
        <p class="uploader__hint">
          <span class="text-primary-600 font-semibold">点击上传</span>
          或拖拽文件到此处
        </p>
        <p class="uploader__format">
          <FileText :size="14" class="inline" />
          支持 .doc / .docx 格式
        </p>
      </div>
    </div>

    <!-- Divider -->
    <div class="uploader__divider">
      <span>或者</span>
    </div>

    <!-- Mock Questions -->
    <AppButton
      variant="secondary"
      block
      @click="loadMockQuestions"
      :disabled="isLoading"
    >
      <Sparkles :size="18" />
      使用内置示例题库
    </AppButton>

    <!-- Features -->
    <div class="uploader__features stagger-enter">
      <div class="uploader__feature">
        <div class="uploader__feature-icon bg-primary-50 text-primary-600">
          <FileText :size="18" />
        </div>
        <div>
          <h4 class="text-sm font-semibold text-neutral-800">Word 智能解析</h4>
          <p class="text-xs text-neutral-500">自动识别选择题与填空题</p>
        </div>
      </div>
      <div class="uploader__feature">
        <div class="uploader__feature-icon bg-success-50 text-success-500">
          <Sparkles :size="18" />
        </div>
        <div>
          <h4 class="text-sm font-semibold text-neutral-800">即时反馈</h4>
          <p class="text-xs text-neutral-500">提交后立即查看成绩与解析</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.uploader {
  @apply max-w-md mx-auto px-6 py-10;
}

.uploader__header {
  @apply text-center mb-8;
}

.uploader__logo {
  @apply w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-50
         flex items-center justify-center
         shadow-sm;
}

.uploader__title {
  @apply text-3xl font-bold text-neutral-900 mb-2;
  font-family: var(--font-serif);
}

.uploader__subtitle {
  @apply text-neutral-500 text-base;
}

.uploader__dropzone {
  @apply relative flex flex-col items-center justify-center
         p-8 mb-6
         border-2 border-dashed border-neutral-300
         rounded-xl
         cursor-pointer
         transition-all ease-out-expo;
  transition-duration: 250ms;
  min-height: 180px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
}

.uploader__dropzone:hover {
  @apply border-primary-400 bg-primary-50/50;
}

.uploader__dropzone--active {
  @apply border-primary-500 bg-primary-50 scale-[1.01];
  box-shadow: 0 0 0 4px rgba(67, 56, 202, 0.1);
}

.uploader__dropzone--loading {
  @apply cursor-wait;
}

.uploader__content {
  @apply flex flex-col items-center gap-3;
}

.uploader__icon-wrapper {
  @apply w-14 h-14 rounded-full bg-primary-50
         flex items-center justify-center mb-1;
}

.uploader__hint {
  @apply text-sm text-neutral-600;
}

.uploader__format {
  @apply text-xs text-neutral-400 flex items-center gap-1;
}

.uploader__loading {
  @apply flex flex-col items-center;
}

.uploader__spinner {
  @apply w-10 h-10 text-primary-500;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.uploader__divider {
  @apply flex items-center gap-4 my-6;
}

.uploader__divider::before,
.uploader__divider::after {
  content: '';
  @apply flex-1 h-px bg-neutral-200;
}

.uploader__divider span {
  @apply text-sm text-neutral-400;
}

.uploader__features {
  @apply mt-8 space-y-3;
}

.uploader__feature {
  @apply flex items-center gap-3 p-3 rounded-lg bg-white/60;
}

.uploader__feature-icon {
  @apply w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0;
}
</style>
