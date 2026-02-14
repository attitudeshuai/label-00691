<script setup lang="ts">
// -*- coding: utf-8 -*-
import { BookOpen, Clock, Send } from 'lucide-vue-next'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useQuizStore } from '@/stores/quiz'
import { useTimer } from '@/composables/useTimer'
import { useToast } from '@/composables/useToast'
import { AppPhase } from '@/types'
import { watch, ref } from 'vue'

const store = useQuizStore()
const toast = useToast()
const timer = useTimer()
const showConfirm = ref(false)

// 进入答题时启动计时器
watch(
  () => store.phase,
  (phase) => {
    if (phase === AppPhase.QUIZ) {
      timer.reset()
      timer.start()
    } else {
      timer.stop()
    }
  },
  { immediate: true },
)

function handleSubmit() {
  if (!store.isAllAnswered) {
    const unanswered = store.totalQuestions - store.answeredCount
    showConfirm.value = true
    toast.warning(`还有 ${unanswered} 道题未作答，确认要提交吗？`)
    return
  }
  doSubmit()
}

function doSubmit() {
  showConfirm.value = false
  timer.stop()
  store.submitAll()
  toast.success('答题已提交，正在计算成绩...')
}

function cancelSubmit() {
  showConfirm.value = false
}
</script>

<template>
  <header class="quiz-header" role="banner">
    <div class="quiz-header__top">
      <div class="quiz-header__brand">
        <BookOpen :size="22" class="text-primary-600" />
        <h1 class="quiz-header__title">{{ store.quizTitle }}</h1>
      </div>

      <div class="quiz-header__actions">
        <div class="quiz-header__timer" aria-label="答题计时">
          <Clock :size="16" class="text-neutral-400" />
          <span class="quiz-header__time">{{ timer.formatted.value }}</span>
        </div>

        <template v-if="!store.isSubmitted">
          <AppButton
            v-if="!showConfirm"
            variant="primary"
            size="sm"
            @click="handleSubmit"
          >
            <Send :size="16" />
            <span class="hidden sm:inline">提交答卷</span>
          </AppButton>

          <!-- 确认提交弹出 -->
          <div v-else class="quiz-header__confirm">
            <span class="text-sm text-warning-600 font-medium">确认提交？</span>
            <AppButton variant="danger" size="sm" @click="doSubmit">确认</AppButton>
            <AppButton variant="ghost" size="sm" @click="cancelSubmit">取消</AppButton>
          </div>
        </template>
      </div>
    </div>

    <!-- Progress -->
    <div class="quiz-header__progress" v-if="!store.isSubmitted">
      <ProgressBar
        :value="store.progress"
        label="答题进度"
        :color="store.progress >= 100 ? 'success' : 'primary'"
      />
    </div>
  </header>
</template>

<style scoped>
.quiz-header {
  @apply bg-white/80 backdrop-blur-md
         border-b border-neutral-200
         sticky top-0 z-30
         px-4 sm:px-6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.quiz-header__top {
  @apply flex items-center justify-between
         py-3;
}

.quiz-header__brand {
  @apply flex items-center gap-2;
}

.quiz-header__title {
  @apply text-lg font-bold text-neutral-800 truncate;
  font-family: var(--font-serif);
  max-width: 240px;
}

@media (min-width: 640px) {
  .quiz-header__title {
    max-width: 400px;
  }
}

.quiz-header__actions {
  @apply flex items-center gap-3;
}

.quiz-header__timer {
  @apply flex items-center gap-1.5 px-3 py-1.5
         bg-neutral-50 rounded-full
         text-sm font-mono text-neutral-600 tabular-nums;
}

.quiz-header__time {
  min-width: 48px;
  text-align: center;
}

.quiz-header__confirm {
  @apply flex items-center gap-2 animate-scale-in;
}

.quiz-header__progress {
  @apply pb-3;
}
</style>
