// -*- coding: utf-8 -*-
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question, UserAnswer, QuizResult } from '@/types'
import { AppPhase, QuestionType } from '@/types'

export const useQuizStore = defineStore('quiz', () => {
  /* ==================== State ==================== */
  const phase = ref<AppPhase>(AppPhase.UPLOAD)
  const questions = ref<Question[]>([])
  const userAnswers = ref<Map<number, UserAnswer>>(new Map())
  const currentIndex = ref(0)
  const startTime = ref(0)
  const endTime = ref(0)
  const isSubmitted = ref(false)
  const quizTitle = ref('智慧答题')

  /* ==================== Getters ==================== */
  const totalQuestions = computed(() => questions.value.length)

  const currentQuestion = computed(() =>
    questions.value[currentIndex.value] || null,
  )

  const answeredCount = computed(() => {
    let count = 0
    for (const q of questions.value) {
      const ua = userAnswers.value.get(q.id)
      if (ua && hasAnswerContent(ua.answer)) {
        count++
      }
    }
    return count
  })

  const progress = computed(() =>
    totalQuestions.value > 0
      ? Math.round((answeredCount.value / totalQuestions.value) * 100)
      : 0,
  )

  const isAllAnswered = computed(() =>
    answeredCount.value === totalQuestions.value,
  )

  const totalScore = computed(() =>
    questions.value.reduce((s, q) => s + q.score, 0),
  )

  const quizResult = computed<QuizResult | null>(() => {
    if (!isSubmitted.value) return null

    let correctCount = 0
    let earnedScore = 0
    const details: UserAnswer[] = []

    for (const q of questions.value) {
      const ua = userAnswers.value.get(q.id)
      const isCorrect = ua ? checkAnswer(q, ua.answer) : false

      if (isCorrect) {
        correctCount++
        earnedScore += q.score
      }

      details.push({
        questionId: q.id,
        answer: ua?.answer || '',
        isCorrect,
      })
    }

    return {
      totalQuestions: totalQuestions.value,
      answeredCount: answeredCount.value,
      correctCount,
      wrongCount: totalQuestions.value - correctCount,
      totalScore: totalScore.value,
      earnedScore,
      accuracy: totalQuestions.value > 0 ? correctCount / totalQuestions.value : 0,
      timeTaken: Math.round((endTime.value - startTime.value) / 1000),
      details,
    }
  })

  /* ==================== Actions ==================== */

  /**
   * 加载题目并进入答题阶段
   */
  function loadQuestions(qs: Question[], title?: string) {
    questions.value = qs
    userAnswers.value = new Map()
    currentIndex.value = 0
    isSubmitted.value = false
    startTime.value = Date.now()
    endTime.value = 0
    phase.value = AppPhase.QUIZ
    if (title) quizTitle.value = title
  }

  /**
   * 跳转到指定题目
   */
  function goToQuestion(index: number) {
    if (index >= 0 && index < totalQuestions.value) {
      currentIndex.value = index
      phase.value = AppPhase.QUIZ
    }
  }

  /**
   * 前一题
   */
  function prevQuestion() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  /**
   * 后一题
   */
  function nextQuestion() {
    if (currentIndex.value < totalQuestions.value - 1) {
      currentIndex.value++
    }
  }

  /**
   * 提交某题答案
   */
  function submitAnswer(questionId: number, answer: string | string[]) {
    userAnswers.value.set(questionId, {
      questionId,
      answer,
    })
  }

  /**
   * 获取某题用户答案
   */
  function getUserAnswer(questionId: number): UserAnswer | undefined {
    return userAnswers.value.get(questionId)
  }

  /**
   * 提交全部答案，计算成绩
   */
  function submitAll() {
    endTime.value = Date.now()
    isSubmitted.value = true
    phase.value = AppPhase.RESULT
  }

  /**
   * 重置，回到上传页面
   */
  function reset() {
    phase.value = AppPhase.UPLOAD
    questions.value = []
    userAnswers.value = new Map()
    currentIndex.value = 0
    isSubmitted.value = false
    startTime.value = 0
    endTime.value = 0
    quizTitle.value = '智慧答题'
  }

  /**
   * 重新答题（保留题目）
   */
  function retry() {
    userAnswers.value = new Map()
    currentIndex.value = 0
    isSubmitted.value = false
    startTime.value = Date.now()
    endTime.value = 0
    phase.value = AppPhase.QUIZ
  }

  return {
    // State
    phase,
    questions,
    userAnswers,
    currentIndex,
    startTime,
    isSubmitted,
    quizTitle,
    // Getters
    totalQuestions,
    currentQuestion,
    answeredCount,
    progress,
    isAllAnswered,
    totalScore,
    quizResult,
    // Actions
    loadQuestions,
    goToQuestion,
    prevQuestion,
    nextQuestion,
    submitAnswer,
    getUserAnswer,
    submitAll,
    reset,
    retry,
  }
})

/* ==================== Helper Functions ==================== */

/**
 * 判断答案是否有内容
 */
function hasAnswerContent(answer: string | string[]): boolean {
  if (Array.isArray(answer)) {
    return answer.some(a => a.trim().length > 0)
  }
  return typeof answer === 'string' && answer.trim().length > 0
}

/**
 * 校验答案是否正确
 */
function checkAnswer(question: Question, userAnswer: string | string[]): boolean {
  if (question.type === QuestionType.CHOICE) {
    const correct = (question.correctAnswer as string).toUpperCase().trim()
    const user = (userAnswer as string).toUpperCase().trim()
    return correct === user
  }

  if (question.type === QuestionType.FILL) {
    const correctAnswers = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer]

    const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer]

    if (correctAnswers.length !== userAnswers.length) return false

    return correctAnswers.every((correct, idx) => {
      const user = userAnswers[idx]?.trim() || ''
      const c = correct.trim().toLowerCase()
      const u = user.toLowerCase()
      // 宽松匹配：去除空格和符号后比较
      return normalize(c) === normalize(u)
    })
  }

  return false
}

/**
 * 标准化字符串用于比较
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[（(）)]/g, '')
    .replace(/[<>]/g, '')
    .trim()
}
