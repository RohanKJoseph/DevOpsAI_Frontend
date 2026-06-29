import { useMemo } from 'react'
import { chatApi } from '../api/chatApi'
import { executeApi } from '../api/executeApi'
import { useChatStore } from '../store/chatStore'
import type { ChatAction, ChatMessage, TelemetryData } from '../types/chat'

const buildId = () => crypto.randomUUID()

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export function useChat() {
  const {
    messages,
    thoughts,
    telemetry,
    actions,
    conversations,
    activeConversationId,
    isThinking,
    appendMessage,
    updateMessage,
    setThinking,
    setTelemetry,
    setThoughts,
    setActions,
    selectConversation,
    addConversation,
  } = useChatStore()

  const recentConversations = useMemo(
    () => conversations.map((conversation, index) => ({ ...conversation, active: conversation.id === activeConversationId || index === 0 })),
    [activeConversationId, conversations],
  )


  const sendMessage = async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || isThinking) {
      return
    }

    const userMessage: ChatMessage = {
      id: buildId(),
      role: 'user',
      content: trimmed,
      createdAt: formatTime(),
    }

    appendMessage(userMessage)
    setThinking(true)

    try {
      const { stream, response } = await chatApi(trimmed)

      // Create the assistant message slot once we have a real response
      const assistantId = buildId()
      appendMessage({ id: assistantId, role: 'assistant', content: '', createdAt: formatTime() })

      const reader = stream.getReader()
      let streamedResponse = ''

      while (true) {
        const result = await reader.read()
        if (result.done) break
        streamedResponse += result.value
        updateMessage(assistantId, streamedResponse)
      }

      // Settle on the final complete response
      updateMessage(assistantId, response.response)
      setTelemetry(response.telemetry)
      setThoughts(response.thoughts)
      setActions(response.actions)
      setThinking(false)
      addConversation({
        id: activeConversationId,
        title: trimmed.slice(0, 26),
        subtitle: response.telemetry.status === 'critical' ? 'Requires attention' : 'Monitoring in progress',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      appendMessage({
        id: buildId(),
        role: 'assistant',
        content: `❌ **Error:** ${errorMessage}`,
        createdAt: formatTime(),
      })
      setThinking(false)
    }
  }

  const executeAction = async (action: ChatAction) => {
    try {
      const result = await executeApi(action)
      const nextTelemetry: TelemetryData = {
        ...telemetry,
        ...result.telemetryPatch,
        logs: result.telemetryPatch.logs ?? telemetry.logs,
      }

      setTelemetry(nextTelemetry)
      setActions([])
      appendMessage({
        id: buildId(),
        role: 'assistant',
        content: result.message,
        createdAt: formatTime(),
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Action execution failed'
      appendMessage({
        id: buildId(),
        role: 'assistant',
        content: `❌ Error executing action: ${errorMessage}`,
        createdAt: formatTime(),
      })
    }
  }

  return {
    messages,
    thoughts,
    telemetry,
    actions,
    recentConversations,
    isThinking,
    sendMessage,
    executeAction,
    selectConversation,
  }
}
