<script setup lang="ts">
// -*- coding: utf-8 -*-
import { computed, watch, ref } from 'vue'
import { ChevronLeft, ChevronRight, BookOpen, PenLine } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import ChoiceQuestion from '@/components/business/ChoiceQuestion.vue'
import FillQuestion from '@/components/business/FillQuestion.vue'
import { useQuizStore } from '@/stores/quiz'
import { QuestionType } from '@/types'

const store = useQuizStore()

const question = computed(() => store.currentQuestion)
const questionKey = ref(0)

// 切题时触发动画
watch(
  () => store.currentIndex,
  () => {
    questionKey.value++
  },
)

const typeLabel = computed(() => {
  if (!question.value) return ''
  return question.value.type === QuestionType.CHOICE ? '选择题' : '填空题'
})

const typeIcon = computed(() => {
  return question.value?.type === QuestionType.CHOICE ? BookOpen : PenLine
})
</script>

<template>
  <div class="question-display" v-if="question">
    <!-- Question Header -->
    <div class="question-display__header">
      <div class="question-display__meta">
        <span class="question-display__index">
          {{ store.currentIndex + 1 }} / {{ store.totalQuestions }}
        </span>
        <span :class="[
          'question-display__type-badge',
          question.type === QuestionType.CHOICE
            ? 'question-display__type-badge--choice'
            : 'question-display__type-badge--fill'
        ]">
          <component :is="typeIcon" :size="14" />
          {{ typeLabel }}
        </span>
        <span class="question-display__score">
          {{ question.score }} 分
        </span>
      </div>
    </div>

    <!-- Question Content -->
    <Transition name="page-slide" mode="out-in">
      <div :key="questionKey" class="question-display__body">
        <h2 class="question-display__content">
          {{ question.content }}
        </h2>

        <!-- Answer Area -->
        <div class="question-display__answer mt-6">
          <ChoiceQuestion
            v-if="question.type === QuestionType.CHOICE"
            :question="question"
          />
          <FillQuestion
            v-else-if="question.type === QuestionType.FILL"
            :question="question"
          />
        </div>
      </div>
    </Transition>

    <!-- Navigation Buttons -->
    <div class="question-display__nav">
      <AppButton
        variant="ghost"
        size="md"
        :disabled="store.currentIndex <= 0"
        @click="store.prevQuestion()"
        aria-label="上一题"
      >
        <ChevronLeft :size="18" />
        上一题
      </AppButton>

      <div class="question-display__nav-dots">
        <span
          v-for="(_, i) in Math.min(store.totalQuestions, 7)"
          :key="i"
          :class="[
            'question-display__nav-dot',
            {
              'question-display__nav-dot--active':
                i === store.currentIndex ||
                (store.totalQuestions > 7 && i === 6 && store.currentIndex >= 6)
            },
          ]"
          @click="store.goToQuestion(i)"
          role="button"
          :aria-label="`跳转到第 ${i + 1} 题`"
        />
        <span
          v-if="store.totalQuestions > 7"
          class="text-neutral-400 text-xs"
        >
          ...+{{ store.totalQuestions - 7 }}
        </span>
      </div>

      <AppButton
        variant="ghost"
        size="md"
        :disabled="store.currentIndex >= store.totalQuestions - 1"
        @click="store.nextQuestion()"
        aria-label="下一题"
      >
        下一题
        <ChevronRight :size="18" />
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.question-display {
  @apply flex flex-col;
}

.question-display__header {
  @apply mb-6;
}

.question-display__meta {
  @apply flex items-center gap-3 flex-wrap;
}

.question-display__index {
  @apply text-sm font-semibold text-neutral-400 tabular-nums;
}

.question-display__type-badge {
  @apply inline-flex items-center gap-1 px-2.5 py-1
         rounded-full text-xs font-semibold;
}

.question-display__type-badge--choice {
  @apply bg-primary-50 text-primary-600;
}

.question-display__type-badge--fill {
  @apply bg-accent-400/10 text-accent-600;
}

.question-display__score {
  @apply text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded;
}

.question-display__body {
  @apply flex-1;
}

.question-display__content {
  @apply text-xl leading-relaxed text-neutral-800;
  font-family: var(--font-serif);
  font-weight: 600;
}

.question-display__answer {
  @apply mt-6;
}

.question-display__nav {
  @apply flex items-center justify-between mt-8 pt-6
         border-t border-neutral-200;
}

.question-display__nav-dots {
  @apply flex items-center gap-1.5;
}

.question-display__nav-dot {
  @apply w-2 h-2 rounded-full bg-neutral-200 cursor-pointer
         transition-all duration-150;
}

.question-display__nav-dot:hover {
  @apply bg-neutral-400;
}

.question-display__nav-dot--active {
  @apply bg-primary-500 w-6;
}

/* Page slide transition */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
