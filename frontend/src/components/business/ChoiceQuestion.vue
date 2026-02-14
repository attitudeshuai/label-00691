<script setup lang="ts">
// -*- coding: utf-8 -*-
import { computed } from 'vue'
import { Check, X } from 'lucide-vue-next'
import type { Question } from '@/types'
import { useQuizStore } from '@/stores/quiz'

interface Props {
  question: Question
}

const props = defineProps<Props>()
const store = useQuizStore()

const selectedOption = computed(() => {
  const ua = store.getUserAnswer(props.question.id)
  return (ua?.answer as string) || ''
})

const resultDetail = computed(() => {
  if (!store.isSubmitted) return null
  return store.quizResult?.details.find(d => d.questionId === props.question.id)
})

function selectOption(label: string) {
  if (store.isSubmitted) return
  store.submitAnswer(props.question.id, label)
}

function getOptionState(label: string) {
  if (!store.isSubmitted) {
    return selectedOption.value === label ? 'selected' : 'default'
  }
  const isCorrectOption = props.question.correctAnswer === label
  const isUserSelection = selectedOption.value === label

  if (isCorrectOption) return 'correct'
  if (isUserSelection && !isCorrectOption) return 'wrong'
  return 'default'
}
</script>

<template>
  <div class="choice-q stagger-enter" role="radiogroup" :aria-label="`第 ${question.id} 题选项`">
    <button
      v-for="(option, idx) in question.options"
      :key="option.label"
      :class="['choice-q__option', `choice-q__option--${getOptionState(option.label)}`]"
      role="radio"
      :aria-checked="selectedOption === option.label"
      :aria-label="`选项 ${option.label}: ${option.content}`"
      :disabled="store.isSubmitted"
      :style="{ animationDelay: `${idx * 50}ms` }"
      @click="selectOption(option.label)"
    >
      <span :class="['choice-q__label', `choice-q__label--${getOptionState(option.label)}`]">
        <template v-if="getOptionState(option.label) === 'correct'">
          <Check :size="16" />
        </template>
        <template v-else-if="getOptionState(option.label) === 'wrong'">
          <X :size="16" />
        </template>
        <template v-else>
          {{ option.label }}
        </template>
      </span>
      <span class="choice-q__content">{{ option.content }}</span>
    </button>

    <!-- 提交后显示解析 -->
    <div v-if="store.isSubmitted && question.explanation" class="choice-q__explanation animate-slide-up">
      <div class="choice-q__explanation-header">
        <span :class="resultDetail?.isCorrect ? 'text-success-600' : 'text-danger-600'">
          {{ resultDetail?.isCorrect ? '回答正确' : '回答错误' }}
        </span>
        <span class="text-neutral-400">|</span>
        <span class="text-neutral-600">正确答案: {{ question.correctAnswer }}</span>
      </div>
      <p class="choice-q__explanation-text">{{ question.explanation }}</p>
    </div>
  </div>
</template>

<style scoped>
.choice-q {
  @apply space-y-3;
}

.choice-q__option {
  @apply w-full flex items-center gap-4
         p-4 rounded-xl
         border-2
         text-left
         cursor-pointer
         transition-all duration-150 ease-out-expo;
  background: transparent;
  font-family: var(--font-sans);
}

.choice-q__option:focus-visible {
  @apply ring-2 ring-primary-400 ring-offset-2;
}

.choice-q__option--default {
  @apply border-neutral-200 bg-white hover:border-primary-300 hover:bg-primary-50/30;
}
.choice-q__option--default:hover:not(:disabled) {
  transform: translateX(4px);
}

.choice-q__option--selected {
  @apply border-primary-500 bg-primary-50;
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.1);
}

.choice-q__option--correct {
  @apply border-success-400 bg-success-50 cursor-default;
}

.choice-q__option--wrong {
  @apply border-danger-400 bg-danger-50 cursor-default;
}

.choice-q__option:disabled {
  @apply cursor-default;
}

.choice-q__label {
  @apply flex-shrink-0 w-8 h-8
         flex items-center justify-center
         rounded-lg
         text-sm font-bold
         transition-all duration-150;
}

.choice-q__label--default {
  @apply bg-neutral-100 text-neutral-500;
}

.choice-q__label--selected {
  @apply bg-primary-600 text-white;
}

.choice-q__label--correct {
  @apply bg-success-500 text-white;
}

.choice-q__label--wrong {
  @apply bg-danger-500 text-white;
}

.choice-q__content {
  @apply text-base text-neutral-700 leading-relaxed;
}

.choice-q__explanation {
  @apply mt-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200;
}

.choice-q__explanation-header {
  @apply flex items-center gap-2 text-sm font-semibold mb-2;
}

.choice-q__explanation-text {
  @apply text-sm text-neutral-600 leading-relaxed;
}
</style>
