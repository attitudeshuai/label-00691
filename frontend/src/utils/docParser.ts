// -*- coding: utf-8 -*-
import mammoth from 'mammoth'
import type { Question, Option } from '@/types'
import { QuestionType } from '@/types'

/**
 * Word 文档答题解析器
 * 支持常见的 Word 试卷格式，自动识别选择题和填空题
 */

/**
 * 解析 Word 文档，提取题目列表
 */
export async function parseWordDocument(file: File): Promise<Question[]> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  const rawText = result.value

  if (!rawText || rawText.trim().length === 0) {
    throw new Error('文档内容为空，请检查文件是否正确')
  }

  return parseTextToQuestions(rawText)
}

/**
 * 将纯文本解析为题目列表
 */
export function parseTextToQuestions(text: string): Question[] {
  const questions: Question[] = []
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)

  let i = 0
  let questionId = 1

  while (i < lines.length) {
    const line = lines[i]

    // 仅匹配数字题号（1. / 2、/ 第1题 等），不匹配大标题（一、选择题 / 二、填空题 等）
    const questionMatch = line.match(
      /^(?:(?:第?\s*)?(\d+)\s*[.、)）:：]\s*|(?:第\s*(\d+)\s*题[.、:：]?\s*))(.*)/
    )

    if (questionMatch) {
      const questionText = questionMatch[3] || ''
      const fullQuestionText = questionText || line.replace(/^[^\u4e00-\u9fa5A-Za-z]*/, '')

      // 查看后续行，判断是否为选择题（是否有 A/B/C/D 选项）
      const optionLines: string[] = []
      let j = i + 1

      // 如果题干不完整，可能跨行
      let extendedContent = fullQuestionText
      while (j < lines.length && !isOptionLine(lines[j]) && !isQuestionLine(lines[j]) && !isAnswerLine(lines[j])) {
        extendedContent += ' ' + lines[j]
        j++
      }

      // 收集选项行
      while (j < lines.length && isOptionLine(lines[j])) {
        optionLines.push(lines[j])
        j++
      }

      // 收集答案行
      let answerText = ''
      if (j < lines.length && isAnswerLine(lines[j])) {
        answerText = extractAnswer(lines[j])
        j++
      }
      // 也可能答案在选项后紧跟
      if (!answerText && j < lines.length && lines[j].match(/^(?:答案|参考答案|正确答案)[：:]/)) {
        answerText = extractAnswer(lines[j])
        j++
      }

      // 收集解析
      let explanation = ''
      if (j < lines.length && lines[j].match(/^(?:解析|解答|说明)[：:]/)) {
        explanation = lines[j].replace(/^(?:解析|解答|说明)[：:]/, '').trim()
        j++
      }

      if (optionLines.length >= 2) {
        // 选择题
        const options = parseOptions(optionLines)
        const correctAnswer = answerText || 'A'

        questions.push({
          id: questionId++,
          type: QuestionType.CHOICE,
          content: extendedContent.trim(),
          options,
          correctAnswer: correctAnswer.toUpperCase(),
          explanation: explanation || undefined,
          score: 10,
        })
      } else {
        // 填空题：检测空格数
        const blanksCount = countBlanks(extendedContent)
        const fillAnswers = answerText
          ? answerText.split(/[,，;；、|]/).map(a => a.trim()).filter(Boolean)
          : ['参考答案']

        questions.push({
          id: questionId++,
          type: QuestionType.FILL,
          content: extendedContent.trim(),
          blanks: Math.max(blanksCount, 1),
          correctAnswer: fillAnswers.length === 1 ? fillAnswers : fillAnswers,
          explanation: explanation || undefined,
          score: 10,
        })
      }

      i = j
    } else {
      i++
    }
  }

  return questions
}

/**
 * 判断是否为选项行
 */
function isOptionLine(line: string): boolean {
  return /^[A-Da-d]\s*[.、)）:：]\s*/.test(line)
}

/**
 * 判断是否为题号行（仅数字题号，不含一、二、等大标题）
 */
function isQuestionLine(line: string): boolean {
  return /^(?:(?:第?\s*)?\d+\s*[.、)）:：]|第\s*\d+\s*题)/.test(line)
}

/**
 * 判断是否为答案行
 */
function isAnswerLine(line: string): boolean {
  return /^(?:答案|参考答案|正确答案|Answer)[：:]/i.test(line)
}

/**
 * 提取答案文本
 */
function extractAnswer(line: string): string {
  const match = line.match(/^(?:答案|参考答案|正确答案|Answer)[：:]\s*(.*)/i)
  return match ? match[1].trim() : ''
}

/**
 * 解析选项
 */
function parseOptions(lines: string[]): Option[] {
  return lines.map(line => {
    const match = line.match(/^([A-Da-d])\s*[.、)）:：]\s*(.*)/)
    if (match) {
      return {
        label: match[1].toUpperCase(),
        content: match[2].trim(),
      }
    }
    return { label: '?', content: line }
  })
}

/**
 * 统计填空数量
 */
function countBlanks(text: string): number {
  // 匹配下划线空格 / 括号空格 / ____
  const underscoreMatches = text.match(/_{2,}|（\s*）|\(\s*\)/g)
  return underscoreMatches ? underscoreMatches.length : 1
}
