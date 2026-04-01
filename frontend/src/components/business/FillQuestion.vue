<script setup lang="ts">
// -*- coding: utf-8 -*-
import { ref, watch, computed } from 'vue'
import { Check, X } from 'lucide-vue-next'
import type { Question } from '@/types'
import { useQuizStore } from '@/stores/quiz'

interface Props {
  question: Question
}

const props = defineProps<Props>()
const store = useQuizStore()

const blanksCount = computed(() => props.question.blanks || 1)

const answers = ref<string[]>(new Array(blanksCount.value).fill(''))

// 初始化已有答案
watch(
  () => props.question.id,
  () => {
    const ua = store.getUserAnswer(props.question.id)
    if (ua && Array.isArray(ua.answer)) {
      answers.value = [...ua.answer]
      // 补足空位
      while (answers.value.length < blanksCount.value) {
        answers.value.push('')
      }
    } else {
      answers.value = new Array(blanksCount.value).fill('')
    }
  },
  { immediate: true },
)

const resultDetail = computed(() => {
  if (!store.isSubmitted) return null
  return store.quizResult?.details.find(d => d.questionId === props.question.id)
})

const correctAnswers = computed(() => {
  if (Array.isArray(props.question.correctAnswer)) {
    return props.question.correctAnswer
  }
  return [props.question.correctAnswer]
})

function onInput(index: number, value: string) {
  answers.value[index] = value
  store.submitAnswer(props.question.id, [...answers.value])
}

function getBlankState(index: number) {
  if (!store.isSubmitted) return 'default'
  const correct = correctAnswers.value[index]?.trim().toLowerCase() || ''
  const user = answers.value[index]?.trim().toLowerCase() || ''
  if (!user) return 'empty'
  // 宽松比较
  const normalizeStr = (s: string) =>
    s.toLowerCase().replace(/\s+/g, '').replace(/[（(）)]/g, '').replace(/[<>]/g, '')
  return normalizeStr(correct) === normalizeStr(user) ? 'correct' : 'wrong'
}
</script>

<template>
  <div class="fill-q">
    <div
      v-for="(_, index) in blanksCount"
      :key="index"
      :class="['fill-q__blank', `fill-q__blank--${getBlankState(index)}`]"
      :style="{ animationDelay: `${index * 60}ms` }"
    >
      <label :for="`blank-${question.id}-${index}`" class="fill-q__label">
        空格 {{ blanksCount > 1 ? index + 1 : '' }}
      </label>
      <div class="fill-q__input-wrapper">
        <input
          :id="`blank-${question.id}-${index}`"
          type="text"
          :value="answers[index]"
          :placeholder="store.isSubmitted ? '' : `请输入第 ${index + 1} 个答案`"
          :disabled="store.isSubmitted"
          :aria-label="`第 ${question.id} 题，空格 ${index + 1}`"
          :class="['fill-q__input', `fill-q__input--${getBlankState(index)}`]"
          autocomplete="off"
          @input="onInput(index, ($event.target as HTMLInputElement).value)"
        />
        <!-- 状态图标 -->
        <span v-if="store.isSubmitted" class="fill-q__status-icon">
          <Check v-if="getBlankState(index) === 'correct'" :size="18" class="text-success-500" />
          <X v-else :size="18" class="text-danger-500" />
        </span>
      </div>
      <!-- 提交后显示正确答案 -->
      <p
        v-if="store.isSubmitted && getBlankState(index) !== 'correct'"
        class="fill-q__correct-answer"
      >
        正确答案: <strong>{{ correctAnswers[index] || '—' }}</strong>
      </p>
    </div>

    <!-- 提交后显示答案和解析 -->
    <div v-if="store.isSubmitted" class="fill-q__explanation">
      <div class="fill-q__explanation-header">
        <span :class="resultDetail?.isCorrect ? 'text-success-600' : 'text-danger-600'">
          {{ resultDetail?.isCorrect ? '回答正确' : '回答错误' }}
        </span>
        <span class="text-neutral-400">|</span>
        <span class="text-neutral-600">正确答案: {{ correctAnswers.join('、') }}</span>
      </div>
      <div v-if="question.explanation" class="fill-q__explanation-divider"></div>
      <p v-if="question.explanation" class="fill-q__explanation-text">{{ question.explanation }}</p>
    </div>
  </div>
</template>

<style scoped>
.fill-q {
  @apply space-y-4;
}

.fill-q__blank {
  @apply animate-slide-up;
}

.fill-q__label {
  @apply block text-sm font-medium text-neutral-500 mb-1.5;
}

.fill-q__input-wrapper {
  @apply relative;
}

.fill-q__input {
  @apply w-full px-4 py-3
         border-2 border-neutral-200
         rounded-xl
         text-base text-neutral-800
         bg-white
         transition-all duration-150 ease-out-expo;
  font-family: var(--font-mono);
  outline: none;
}

.fill-q__input::placeholder {
  @apply text-neutral-400;
  font-family: var(--font-sans);
}

.fill-q__input:focus:not(:disabled) {
  @apply border-primary-400;
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.1);
}

.fill-q__input:disabled {
  @apply bg-neutral-50 cursor-default;
}

.fill-q__input--correct {
  @apply border-success-400 bg-success-50/50;
}

.fill-q__input--wrong {
  @apply border-danger-400 bg-danger-50/50;
}

.fill-q__input--empty {
  @apply border-danger-300 bg-danger-50/30;
}

.fill-q__status-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2;
}

.fill-q__correct-answer {
  @apply mt-1.5 text-sm text-danger-600;
}

.fill-q__correct-answer strong {
  @apply font-mono;
}

.fill-q__explanation {
  @apply mt-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200;
}

.fill-q__explanation-header {
  @apply flex items-center gap-2 text-sm font-semibold;
}

.fill-q__explanation-divider {
  @apply my-3 border-t border-neutral-200;
}

.fill-q__explanation-text {
  @apply text-sm text-neutral-600 leading-relaxed;
}
</style>
