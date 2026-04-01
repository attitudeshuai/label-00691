<script setup lang="ts">
// -*- coding: utf-8 -*-
import { computed, ref, onMounted } from 'vue'
import {
  Trophy,
  Target,
  Clock,
  RotateCcw,
  Upload,
  CheckCircle2,
  XCircle,
  BarChart3,
} from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import { useQuizStore } from '@/stores/quiz'

const store = useQuizStore()
const result = computed(() => store.quizResult)
const animatedScore = ref(0)
const showDetails = ref(false)

onMounted(() => {
  if (!result.value) return
  // 分数滚动动画
  const target = result.value.earnedScore
  const duration = 800
  const startTime = Date.now()

  function animate() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Ease out expo
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedScore.value = Math.round(target * eased)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
})

const grade = computed(() => {
  if (!result.value) return { label: '', color: '', emoji: '' }
  const accuracy = result.value.accuracy
  if (accuracy >= 0.9) return { label: '优秀', color: 'text-success-600', bg: 'bg-success-50' }
  if (accuracy >= 0.7) return { label: '良好', color: 'text-info-600', bg: 'bg-info-50' }
  if (accuracy >= 0.6) return { label: '及格', color: 'text-accent-600', bg: 'bg-accent-400/10' }
  return { label: '需加油', color: 'text-danger-600', bg: 'bg-danger-50' }
})

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m} 分 ${s} 秒` : `${s} 秒`
}
</script>

<template>
  <div class="result animate-fade-in" v-if="result">
    <!-- Score Hero -->
    <div class="result__hero">
      <div class="result__score-ring">
        <svg viewBox="0 0 120 120" class="result__ring-svg">
          <!-- Background ring -->
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="currentColor"
            stroke-width="8"
            class="text-neutral-100"
          />
          <!-- Progress ring -->
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            :stroke="result.accuracy >= 0.6 ? '#10B981' : '#EF4444'"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="`${result.accuracy * 326.7} 326.7`"
            transform="rotate(-90 60 60)"
            class="result__ring-progress"
          />
        </svg>
        <div class="result__score-text">
          <span class="result__score-number">{{ animatedScore }}</span>
          <span class="result__score-total">/ {{ result.totalScore }}</span>
        </div>
      </div>

      <div :class="['result__grade', grade.bg, grade.color]">
        {{ grade.label }}
      </div>

      <h2 class="result__title">答题完成</h2>
    </div>

    <!-- Stats Grid -->
    <div class="result__stats stagger-enter">
      <div class="result__stat-card">
        <Target :size="22" class="text-primary-500" />
        <div>
          <p class="result__stat-value">{{ (result.accuracy * 100).toFixed(0) }}%</p>
          <p class="result__stat-label">正确率</p>
        </div>
      </div>
      <div class="result__stat-card">
        <CheckCircle2 :size="22" class="text-success-500" />
        <div>
          <p class="result__stat-value">{{ result.correctCount }}</p>
          <p class="result__stat-label">答对</p>
        </div>
      </div>
      <div class="result__stat-card">
        <XCircle :size="22" class="text-danger-500" />
        <div>
          <p class="result__stat-value">{{ result.wrongCount }}</p>
          <p class="result__stat-label">答错</p>
        </div>
      </div>
      <div class="result__stat-card">
        <Clock :size="22" class="text-accent-500" />
        <div>
          <p class="result__stat-value">{{ formatTime(result.timeTaken) }}</p>
          <p class="result__stat-label">用时</p>
        </div>
      </div>
    </div>

    <!-- Toggle Details -->
    <button
      class="result__toggle-details"
      @click="showDetails = !showDetails"
      :aria-expanded="showDetails"
    >
      <BarChart3 :size="16" />
      {{ showDetails ? '收起详情' : '查看答题详情' }}
    </button>

    <!-- Details -->
    <Transition name="expand">
      <div v-if="showDetails" class="result__details">
        <div
          v-for="(detail, idx) in result.details"
          :key="detail.questionId"
          :class="[
            'result__detail-item',
            detail.isCorrect ? 'result__detail-item--correct' : 'result__detail-item--wrong',
          ]"
        >
          <span class="result__detail-num">{{ idx + 1 }}</span>
          <span class="result__detail-status">
            <CheckCircle2 v-if="detail.isCorrect" :size="16" class="text-success-500" />
            <XCircle v-else :size="16" class="text-danger-500" />
          </span>
          <span class="result__detail-answer">
            您的答案: <code>{{ Array.isArray(detail.answer) ? detail.answer.join(', ') : detail.answer || '未作答' }}</code>
          </span>
          <button
            class="result__detail-goto text-primary-600 hover:text-primary-800 text-sm"
            @click="store.viewQuestionDetail(idx)"
            aria-label="查看此题"
          >
            查看
          </button>
        </div>
      </div>
    </Transition>

    <!-- Actions -->
    <div class="result__actions">
      <AppButton variant="primary" size="lg" @click="store.retry()">
        <RotateCcw :size="18" />
        重新答题
      </AppButton>
      <AppButton variant="secondary" size="lg" @click="store.reset()">
        <Upload :size="18" />
        更换题库
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.result {
  @apply max-w-lg mx-auto px-4 py-8;
}

.result__hero {
  @apply text-center mb-8;
}

.result__score-ring {
  @apply relative w-36 h-36 mx-auto mb-4;
}

.result__ring-svg {
  @apply w-full h-full;
}

.result__ring-progress {
  transition: stroke-dasharray 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.result__score-text {
  @apply absolute inset-0 flex flex-col items-center justify-center;
}

.result__score-number {
  @apply text-4xl font-bold text-neutral-900 tabular-nums;
  font-family: var(--font-serif);
}

.result__score-total {
  @apply text-sm text-neutral-400;
}

.result__grade {
  @apply inline-block px-4 py-1 rounded-full text-sm font-bold mb-3;
}

.result__title {
  @apply text-2xl text-neutral-800;
  font-family: var(--font-serif);
}

.result__stats {
  @apply grid grid-cols-2 gap-3 mb-6;
}

@media (min-width: 640px) {
  .result__stats {
    @apply grid-cols-4;
  }
}

.result__stat-card {
  @apply flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100;
  box-shadow: var(--shadow-sm);
}

.result__stat-value {
  @apply text-lg font-bold text-neutral-800 tabular-nums;
}

.result__stat-label {
  @apply text-xs text-neutral-500;
}

.result__toggle-details {
  @apply w-full flex items-center justify-center gap-2
         py-3 mb-4
         text-sm font-medium text-neutral-500
         bg-transparent border-0 cursor-pointer
         hover:text-primary-600 transition-colors;
}

.result__details {
  @apply space-y-2 mb-6;
}

.result__detail-item {
  @apply flex items-center gap-3 px-4 py-2.5
         rounded-lg text-sm;
}

.result__detail-item--correct {
  @apply bg-success-50/50;
}

.result__detail-item--wrong {
  @apply bg-danger-50/50;
}

.result__detail-num {
  @apply w-6 text-center font-semibold text-neutral-400 tabular-nums;
}

.result__detail-status {
  @apply flex-shrink-0;
}

.result__detail-answer {
  @apply flex-1 text-neutral-600;
}

.result__detail-answer code {
  @apply font-mono text-neutral-800 bg-white/50 px-1.5 py-0.5 rounded;
}

.result__detail-goto {
  @apply flex-shrink-0 bg-transparent border-0 cursor-pointer font-medium;
}

.result__actions {
  @apply flex flex-col sm:flex-row gap-3;
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
