import { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { PromptChips } from './PromptChips'
import { ChatInput } from './ChatInput'
import { useChat } from '../../hooks/useChat'

const PROMPT_SUGGESTIONS = [
  'What is the current cluster health?',
  'Why is CPU spiking?',
  'Show me recent pod logs',
]

export function ChatWindow() {
  const { messages, isThinking, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom whenever messages update or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const isEmpty = messages.length === 0

  return (
    <>
      {/* ── Scrollable messages ── */}
      <div className="chat-messages" id="chat-messages-scroll">

        {isEmpty ? (
          /* ── Centered welcome / empty state ── */
          <div className="chat-empty">
            <div className="chat-empty__icon">🤖</div>
            <h2>AI-Assisted DevOps Agent</h2>
            <p>
              Ask me about cluster health, live metrics, pod logs, or
              recommended remediation steps. I have real-time telemetry context.
            </p>
          </div>
        ) : (
          /* ── Message list ── */
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {/* ── Typing indicator (only when waiting, never alongside a bubble) ── */}
        {isThinking && (
          <div className="typing-wrap">
            <div className="typing-meta">
              <div className="typing-avatar">AI</div>
              <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>
                Sentinel AI
              </span>
            </div>
            <div className="typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input zone ── */}
      <div className="chat-input-zone">
        <div className="chat-input-zone__inner">
          {isEmpty && (
            <PromptChips
              prompts={PROMPT_SUGGESTIONS}
              onPromptSelect={(prompt) => void sendMessage(prompt)}
            />
          )}
          <ChatInput onSubmit={sendMessage} disabled={isThinking} />
          <p className="chat-input__hint">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </>
  )
}
