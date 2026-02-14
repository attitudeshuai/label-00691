<script setup lang="ts">
// -*- coding: utf-8 -*-
import { computed } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import { QuestionType } from '@/types'

const store = useQuizStore()

const questionStatuses = computed(() =>
  store.questions.map((q, idx) => {
    const ua = store.userAnswers.get(q.id)
    const isCurrent = idx === store.currentIndex
    const isAnswered = ua && hasContent(ua.answer)

    if (store.isSubmitted) {
      const detail = store.quizResult?.details.find(d => d.questionId === q.id)
      if (detail?.isCorrect) return { ...q, status: 'correct' as const, isCurrent }
      return { ...q, status: 'wrong' as const, isCurrent }
    }

    if (isCurrent) return { ...q, status: 'current' as const, isCurrent }
    if (isAnswered) return { ...q, status: 'answered' as const, isCurrent }
    return { ...q, status: 'unanswered' as const, isCurrent }
  }),
)

function hasContent(answer: string | string[]): boolean {
  if (Array.isArray(answer)) return answer.some(a => a.trim().length > 0)
  return typeof answer === 'string' && answer.trim().length > 0
}

function goTo(index: number) {
  store.goToQuestion(index)
}

function getTypeLabel(type: QuestionType): string {
  return type === QuestionType.CHOICE ? '选' : '填'
}
</script>

<template>
  <nav class="quiz-nav custom-scrollbar" aria-label="题目导航">
    <h3 class="quiz-nav__title">题目导航</h3>

    <div class="quiz-nav__legend">
      <span class="quiz-nav__legend-item">
        <span class="quiz-nav__dot quiz-nav__dot--current" />当前
      </span>
      <span class="quiz-nav__legend-item">
        <span class="quiz-nav__dot quiz-nav__dot--answered" />已答
      </span>
      <span class="quiz-nav__legend-item">
        <span class="quiz-nav__dot quiz-nav__dot--unanswered" />未答
      </span>
      <template v-if="store.isSubmitted">
        <span class="quiz-nav__legend-item">
          <span class="quiz-nav__dot quiz-nav__dot--correct" />正确
        </span>
        <span class="quiz-nav__legend-item">
          <span class="quiz-nav__dot quiz-nav__dot--wrong" />错误
        </span>
      </template>
    </div>

    <div class="quiz-nav__grid" role="list">
      <button
        v-for="(item, index) in questionStatuses"
        :key="item.id"
        :class="[
          'quiz-nav__item',
          `quiz-nav__item--${item.status}`,
        ]"
        role="listitem"
        :aria-label="`第 ${index + 1} 题，${item.status === 'answered' ? '已作答' : item.status === 'correct' ? '回答正确' : item.status === 'wrong' ? '回答错误' : '未作答'}`"
        :aria-current="item.isCurrent ? 'true' : undefined"
        @click="goTo(index)"
      >
        <span class="quiz-nav__num">{{ index + 1 }}</span>
        <span class="quiz-nav__type">{{ getTypeLabel(item.type) }}</span>
      </button>
    </div>

    <div class="quiz-nav__stats">
      <div class="quiz-nav__stat">
        <span class="text-neutral-500">已答</span>
        <span class="font-semibold text-primary-700">
          {{ store.answeredCount }} / {{ store.totalQuestions }}
        </span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.quiz-nav {
  @apply p-4;
}

.quiz-nav__title {
  @apply text-lg font-bold text-neutral-800 mb-3;
  font-family: var(--font-serif);
}

.quiz-nav__legend {
  @apply flex flex-wrap gap-3 mb-4 text-xs text-neutral-500;
}

.quiz-nav__legend-item {
  @apply flex items-center gap-1;
}

.quiz-nav__dot {
  @apply w-2.5 h-2.5 rounded-full;
}
.quiz-nav__dot--current { @apply bg-primary-500; }
.quiz-nav__dot--answered { @apply bg-info-500; }
.quiz-nav__dot--unanswered { @apply bg-neutral-300; }
.quiz-nav__dot--correct { @apply bg-success-500; }
.quiz-nav__dot--wrong { @apply bg-danger-500; }

.quiz-nav__grid {
  @apply grid grid-cols-5 gap-2;
}

@media (max-width: 1024px) {
  .quiz-nav__grid {
    @apply grid-cols-8;
  }
}

@media (max-width: 640px) {
  .quiz-nav__grid {
    @apply grid-cols-6;
  }
}

.quiz-nav__item {
  @apply relative flex flex-col items-center justify-center
         w-full aspect-square
         rounded-lg
         border-2
         cursor-pointer
         font-sans font-semibold
         transition-all duration-150 ease-out-expo;
  background: transparent;
}

.quiz-nav__item:hover {
  transform: translateY(-1px);
}

.quiz-nav__item:focus-visible {
  @apply ring-2 ring-primary-400 ring-offset-1;
}

.quiz-nav__item--unanswered {
  @apply border-neutral-200 text-neutral-400 bg-white;
}
.quiz-nav__item--unanswered:hover {
  @apply border-neutral-300 bg-neutral-50;
}

.quiz-nav__item--current {
  @apply border-primary-500 text-primary-700 bg-primary-50;
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.15);
}

.quiz-nav__item--answered {
  @apply border-info-300 text-info-600 bg-info-50;
}

.quiz-nav__item--correct {
  @apply border-success-400 text-success-600 bg-success-50;
}

.quiz-nav__item--wrong {
  @apply border-danger-400 text-danger-600 bg-danger-50;
}

.quiz-nav__num {
  @apply text-sm leading-none;
}

.quiz-nav__type {
  @apply text-[10px] opacity-60 mt-0.5;
}

.quiz-nav__stats {
  @apply mt-4 pt-3 border-t border-neutral-200;
}

.quiz-nav__stat {
  @apply flex items-center justify-between text-sm;
}
</style>
