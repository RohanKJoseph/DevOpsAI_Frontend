import axios from 'axios'
import type { ChatAction, ChatResponse, TelemetryData } from '../types/chat'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
})

// Convert text response to a streaming ReadableStream for word-by-word display
const buildStream = (text: string) =>
  new ReadableStream<string>({
    start(controller) {
      void (async () => {
        const words = text.split(/(\s+)/)
        for (const word of words) {
          controller.enqueue(word)
          // Small delay to simulate streaming effect
          await new Promise((resolve) => window.setTimeout(resolve, 25))
        }
        controller.close()
      })().catch((error) => controller.error(error))
    },
  })

export interface ChatApiResult {
  stream: ReadableStream<string>
  response: ChatResponse
}

export async function chatApi(message: string): Promise<ChatApiResult> {
  try {
    // POST to /api/chat with user message
    const response = await apiClient.post<{
      response: string
      thoughts: string[]
      telemetry: TelemetryData
      actions: ChatAction[]
    }>('/api/chat', {
      message,
    })

    const { response: assistantText, thoughts, telemetry, actions } = response.data

    return {
      stream: buildStream(assistantText),
      response: {
        response: assistantText,
        thoughts,
        telemetry,
        actions,
      },
    }
  } catch (error) {
    console.error('Chat API error:', error)
    throw new Error(
      error instanceof axios.AxiosError
        ? `Backend error: ${error.response?.status} - ${error.message}`
        : 'Failed to reach backend',
    )
  }
}
