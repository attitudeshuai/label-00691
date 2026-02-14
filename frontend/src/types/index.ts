// -*- coding: utf-8 -*-

/**
 * 题目类型枚举
 */
export enum QuestionType {
  /** 选择题（单选） */
  CHOICE = 'choice',
  /** 填空题 */
  FILL = 'fill',
}

/**
 * 选项
 */
export interface Option {
  /** 选项标号: A / B / C / D */
  label: string
  /** 选项内容 */
  content: string
}

/**
 * 题目
 */
export interface Question {
  /** 题目 ID（从 1 开始） */
  id: number
  /** 题目类型 */
  type: QuestionType
  /** 题干 */
  content: string
  /** 选择题选项（仅选择题） */
  options?: Option[]
  /** 填空题空格数（仅填空题） */
  blanks?: number
  /** 正确答案：选择题为 "A"/"B"/...，填空题为 string[] */
  correctAnswer: string | string[]
  /** 题目解析 */
  explanation?: string
  /** 分值 */
  score: number
}

/**
 * 用户答案
 */
export interface UserAnswer {
  /** 对应题目 ID */
  questionId: number
  /** 用户填写的答案 */
  answer: string | string[]
  /** 是否正确 */
  isCorrect?: boolean
}

/**
 * 题号状态
 */
export enum QuestionStatus {
  /** 未答 */
  UNANSWERED = 'unanswered',
  /** 已答 */
  ANSWERED = 'answered',
  /** 答对（提交后） */
  CORRECT = 'correct',
  /** 答错（提交后） */
  WRONG = 'wrong',
  /** 当前题目 */
  CURRENT = 'current',
}

/**
 * 答题结果
 */
export interface QuizResult {
  /** 总题数 */
  totalQuestions: number
  /** 已答题数 */
  answeredCount: number
  /** 答对数 */
  correctCount: number
  /** 答错数 */
  wrongCount: number
  /** 总分 */
  totalScore: number
  /** 得分 */
  earnedScore: number
  /** 正确率 (0~1) */
  accuracy: number
  /** 用时（秒） */
  timeTaken: number
  /** 各题详情 */
  details: UserAnswer[]
}

/**
 * 应用状态阶段
 */
export enum AppPhase {
  /** 上传/选择题库 */
  UPLOAD = 'upload',
  /** 答题中 */
  QUIZ = 'quiz',
  /** 已提交，查看结果 */
  RESULT = 'result',
}

/**
 * Toast 消息类型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: number
  type: ToastType
  text: string
  duration?: number
}
