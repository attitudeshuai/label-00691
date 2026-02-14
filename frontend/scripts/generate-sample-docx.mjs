// -*- coding: utf-8 -*-
/**
 * 生成示例 Word 文档用于测试答题应用的导入功能
 */
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputPath = path.resolve(__dirname, '../public/samples/示例试卷-计算机基础.docx')

// 创建文档
const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // 标题
        new Paragraph({
          text: '计算机基础知识测验',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 400 },
        }),

        // 选择题标题
        new Paragraph({
          text: '一、选择题（每题10分，共40分）',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
        }),

        // 第1题
        new Paragraph({
          children: [new TextRun({ text: '1. 在计算机中，1KB等于多少字节？', bold: true })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({ text: 'A. 1000字节' }),
        new Paragraph({ text: 'B. 1024字节' }),
        new Paragraph({ text: 'C. 512字节' }),
        new Paragraph({ text: 'D. 2048字节' }),
        new Paragraph({
          children: [new TextRun({ text: '答案: B', color: '2563EB' })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '解析: 1KB = 2^10 = 1024字节，这是计算机存储的基本换算单位。', italics: true })],
          spacing: { after: 200 },
        }),

        // 第2题
        new Paragraph({
          children: [new TextRun({ text: '2. 以下哪种编程语言是解释型语言？', bold: true })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({ text: 'A. C语言' }),
        new Paragraph({ text: 'B. Java' }),
        new Paragraph({ text: 'C. Python' }),
        new Paragraph({ text: 'D. C++' }),
        new Paragraph({
          children: [new TextRun({ text: '答案: C', color: '2563EB' })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '解析: Python是典型的解释型语言，代码逐行解释执行，无需预编译。', italics: true })],
          spacing: { after: 200 },
        }),

        // 第3题
        new Paragraph({
          children: [new TextRun({ text: '3. HTTP协议默认使用的端口号是？', bold: true })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({ text: 'A. 21' }),
        new Paragraph({ text: 'B. 22' }),
        new Paragraph({ text: 'C. 80' }),
        new Paragraph({ text: 'D. 443' }),
        new Paragraph({
          children: [new TextRun({ text: '答案: C', color: '2563EB' })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '解析: HTTP默认端口80，HTTPS默认端口443，FTP默认端口21，SSH默认端口22。', italics: true })],
          spacing: { after: 200 },
        }),

        // 第4题
        new Paragraph({
          children: [new TextRun({ text: '4. 以下哪个不是关系型数据库？', bold: true })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({ text: 'A. MySQL' }),
        new Paragraph({ text: 'B. PostgreSQL' }),
        new Paragraph({ text: 'C. MongoDB' }),
        new Paragraph({ text: 'D. Oracle' }),
        new Paragraph({
          children: [new TextRun({ text: '答案: C', color: '2563EB' })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '解析: MongoDB是文档型NoSQL数据库，而MySQL、PostgreSQL、Oracle都是关系型数据库。', italics: true })],
          spacing: { after: 200 },
        }),

        // 填空题标题
        new Paragraph({
          text: '二、填空题（每题15分，共60分）',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),

        // 第5题
        new Paragraph({
          children: [new TextRun({ text: '5. HTML中，用于创建超链接的标签是____。', bold: true })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '答案: <a>', color: '2563EB' })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '解析: <a>标签（anchor）用于创建超链接，通过href属性指定链接目标。', italics: true })],
          spacing: { after: 200 },
        }),

        // 第6题
        new Paragraph({
          children: [new TextRun({ text: '6. JavaScript中，用于声明常量的关键字是____，声明变量的关键字是____。', bold: true })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '答案: const, let', color: '2563EB' })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '解析: ES6引入了const用于声明常量（不可重新赋值），let用于声明块级作用域变量。', italics: true })],
          spacing: { after: 200 },
        }),

        // 第7题
        new Paragraph({
          children: [new TextRun({ text: '7. Git中，将本地更改推送到远程仓库的命令是____。', bold: true })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '答案: git push', color: '2563EB' })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '解析: git push命令用于将本地分支的更新推送到远程仓库对应分支。', italics: true })],
          spacing: { after: 200 },
        }),

        // 第8题
        new Paragraph({
          children: [new TextRun({ text: '8. CSS中，设置元素水平居中的常用方法是设置____属性为auto。', bold: true })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '答案: margin', color: '2563EB' })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: '解析: 对于块级元素，设置margin: 0 auto或margin-left: auto; margin-right: auto可实现水平居中。', italics: true })],
          spacing: { after: 200 },
        }),
      ],
    },
  ],
})

// 确保目录存在
const outputDir = path.dirname(outputPath)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 生成并保存文档
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer)
  console.log(`✅ 示例 Word 文档已生成: ${outputPath}`)
})
