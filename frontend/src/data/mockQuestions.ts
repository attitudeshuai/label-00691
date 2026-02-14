// -*- coding: utf-8 -*-
import type { Question } from '@/types'
import { QuestionType } from '@/types'

/**
 * 内置示例题库 — 计算机基础与编程知识
 * 共 10 道题（6 选择 + 4 填空），总分 100 分
 */
export const mockQuestions: Question[] = [
  {
    id: 1,
    type: QuestionType.CHOICE,
    content: 'HTTP 协议中，状态码 404 表示什么含义？',
    options: [
      { label: 'A', content: '服务器内部错误' },
      { label: 'B', content: '请求的资源未找到' },
      { label: 'C', content: '请求被重定向' },
      { label: 'D', content: '请求未授权' },
    ],
    correctAnswer: 'B',
    explanation: 'HTTP 404 状态码表示服务器找不到请求的资源。这是最常见的错误状态码之一。',
    score: 10,
  },
  {
    id: 2,
    type: QuestionType.CHOICE,
    content: '在数据结构中，以下哪种结构遵循"先进后出"(LIFO) 原则？',
    options: [
      { label: 'A', content: '队列 (Queue)' },
      { label: 'B', content: '栈 (Stack)' },
      { label: 'C', content: '链表 (Linked List)' },
      { label: 'D', content: '二叉树 (Binary Tree)' },
    ],
    correctAnswer: 'B',
    explanation: '栈（Stack）是一种后进先出（LIFO）的数据结构，只能在栈顶进行插入和删除操作。',
    score: 10,
  },
  {
    id: 3,
    type: QuestionType.CHOICE,
    content: 'CSS 中 flex-direction: row 的主轴方向是？',
    options: [
      { label: 'A', content: '从上到下' },
      { label: 'B', content: '从下到上' },
      { label: 'C', content: '从左到右' },
      { label: 'D', content: '从右到左' },
    ],
    correctAnswer: 'C',
    explanation: 'flex-direction: row 是 Flexbox 的默认值，主轴方向为水平从左到右。',
    score: 10,
  },
  {
    id: 4,
    type: QuestionType.CHOICE,
    content: '关系型数据库中，用于唯一标识表中每一行记录的字段称为？',
    options: [
      { label: 'A', content: '外键 (Foreign Key)' },
      { label: 'B', content: '主键 (Primary Key)' },
      { label: 'C', content: '索引 (Index)' },
      { label: 'D', content: '视图 (View)' },
    ],
    correctAnswer: 'B',
    explanation: '主键（Primary Key）是关系型数据库中用于唯一标识表中每一行记录的一个或多个字段的组合。',
    score: 10,
  },
  {
    id: 5,
    type: QuestionType.CHOICE,
    content: 'JavaScript 中，以下哪个方法用于将 JSON 字符串转换为 JavaScript 对象？',
    options: [
      { label: 'A', content: 'JSON.stringify()' },
      { label: 'B', content: 'JSON.parse()' },
      { label: 'C', content: 'JSON.toObject()' },
      { label: 'D', content: 'JSON.decode()' },
    ],
    correctAnswer: 'B',
    explanation: 'JSON.parse() 方法将 JSON 格式的字符串解析为 JavaScript 对象。JSON.stringify() 则是反向操作。',
    score: 10,
  },
  {
    id: 6,
    type: QuestionType.CHOICE,
    content: 'Git 中，将远程仓库的最新更改拉取并合并到本地分支的命令是？',
    options: [
      { label: 'A', content: 'git fetch' },
      { label: 'B', content: 'git clone' },
      { label: 'C', content: 'git pull' },
      { label: 'D', content: 'git push' },
    ],
    correctAnswer: 'C',
    explanation: 'git pull 相当于 git fetch + git merge，它会从远程仓库获取最新更改并自动合并到当前分支。',
    score: 10,
  },
  {
    id: 7,
    type: QuestionType.FILL,
    content: 'TCP/IP 协议模型共分为____层，从上到下依次是应用层、传输层、网络层和____。',
    blanks: 2,
    correctAnswer: ['4', '网络接口层'],
    explanation: 'TCP/IP 协议模型分为 4 层：应用层、传输层、网络层（网际层）和网络接口层（链路层）。',
    score: 10,
  },
  {
    id: 8,
    type: QuestionType.FILL,
    content: '在 HTML 中，用于定义文档标题的标签是____，它位于____标签内部。',
    blanks: 2,
    correctAnswer: ['<title>', '<head>'],
    explanation: '<title> 标签用于定义 HTML 文档的标题，它必须放在 <head> 标签内。',
    score: 10,
  },
  {
    id: 9,
    type: QuestionType.FILL,
    content: 'Python 中，用于定义函数的关键字是____。',
    blanks: 1,
    correctAnswer: ['def'],
    explanation: 'Python 使用 def 关键字来定义函数，语法为 def function_name(parameters):',
    score: 10,
  },
  {
    id: 10,
    type: QuestionType.FILL,
    content: '排序算法中，快速排序的平均时间复杂度为____，最坏时间复杂度为____。',
    blanks: 2,
    correctAnswer: ['O(nlogn)', 'O(n²)'],
    explanation: '快速排序平均时间复杂度为 O(n log n)，最坏情况（已排序数组且每次选最小/最大元素为枢轴）为 O(n²)。',
    score: 10,
  },
]
