<script setup lang="ts">
// -*- coding: utf-8 -*-
import { computed } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { AppPhase } from '@/types'
import FileUploader from '@/components/business/FileUploader.vue'
import QuizHeader from '@/components/business/QuizHeader.vue'
import QuizNav from '@/components/business/QuizNav.vue'
import QuestionDisplay from '@/components/business/QuestionDisplay.vue'
import QuizResult from '@/components/business/QuizResult.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const store = useQuizStore()
const isUploadPhase = computed(() => store.phase === AppPhase.UPLOAD)
const isQuizPhase = computed(() => store.phase === AppPhase.QUIZ)
const isResultPhase = computed(() => store.phase === AppPhase.RESULT)
</script>

<template>
  <!-- Skip link for accessibility -->
  <a href="#main-content" class="skip-link">跳到主要内容</a>

  <ToastContainer />

  <!-- Upload Phase -->
  <div v-if="isUploadPhase" class="app-upload">
    <main id="main-content" class="app-upload__main">
      <FileUploader />
    </main>
  </div>

  <!-- Quiz Phase -->
  <div v-else-if="isQuizPhase" class="app-quiz">
    <QuizHeader />
    <div class="app-quiz__layout">
      <!-- Sidebar Navigation (desktop) -->
      <aside class="app-quiz__sidebar custom-scrollbar" aria-label="题目导航侧栏">
        <QuizNav />
      </aside>

      <!-- Main Content -->
      <main id="main-content" class="app-quiz__main">
        <div class="app-quiz__content card p-6 sm:p-8">
          <QuestionDisplay />
        </div>

        <!-- Mobile Navigation (bottom sheet) -->
        <details class="app-quiz__mobile-nav">
          <summary class="app-quiz__mobile-nav-trigger">
            <span>题目导航</span>
            <span class="text-primary-600 font-semibold">
              {{ store.answeredCount }}/{{ store.totalQuestions }}
            </span>
          </summary>
          <div class="app-quiz__mobile-nav-content">
            <QuizNav />
          </div>
        </details>
      </main>
    </div>
  </div>

  <!-- Result Phase -->
  <div v-else-if="isResultPhase" class="app-result">
    <QuizHeader />
    <main id="main-content" class="app-result__main">
      <div class="app-result__content card p-6 sm:p-8">
        <QuizResult />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ============ Upload Phase ============ */
.app-upload {
  @apply min-h-screen flex items-center justify-center px-4;
}

.app-upload__main {
  @apply w-full;
}

/* ============ Quiz Phase ============ */
.app-quiz {
  @apply min-h-screen;
}

.app-quiz__layout {
  @apply flex;
}

.app-quiz__sidebar {
  @apply hidden lg:block
         w-[280px] flex-shrink-0
         bg-white/70 backdrop-blur-sm
         border-r border-neutral-200
         sticky top-[var(--header-height)]
         overflow-y-auto;
  height: calc(100vh - var(--header-height) - 44px);
  /* 44px = progress bar area */
}

.app-quiz__main {
  @apply flex-1 p-4 sm:p-6 lg:p-8
         max-w-[var(--max-content-width)] mx-auto w-full;
}

.app-quiz__content {
  @apply animate-fade-in;
}

/* Mobile navigation */
.app-quiz__mobile-nav {
  @apply lg:hidden mt-4;
}

.app-quiz__mobile-nav-trigger {
  @apply flex items-center justify-between
         px-4 py-3
         bg-white rounded-xl
         border border-neutral-200
         cursor-pointer
         text-sm font-medium text-neutral-600;
  list-style: none;
}

.app-quiz__mobile-nav-trigger::-webkit-details-marker {
  display: none;
}

.app-quiz__mobile-nav-content {
  @apply mt-2 bg-white rounded-xl border border-neutral-200;
}

/* ============ Result Phase ============ */
.app-result {
  @apply min-h-screen;
}

.app-result__main {
  @apply p-4 sm:p-6 lg:p-8
         max-w-[var(--max-content-width)] mx-auto;
}

.app-result__content {
  @apply animate-fade-in;
}
</style>
