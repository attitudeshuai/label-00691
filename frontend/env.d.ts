/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module 'mammoth' {
  interface MammothResult {
    value: string
    messages: Array<{ type: string; message: string }>
  }
  interface MammothOptions {
    arrayBuffer: ArrayBuffer
  }
  export function extractRawText(options: MammothOptions): Promise<MammothResult>
  export function convertToHtml(options: MammothOptions): Promise<MammothResult>
}
