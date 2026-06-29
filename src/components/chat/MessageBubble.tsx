import ReactMarkdown from 'react-markdown'
import type { ChatMessage } from '../../types/chat'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  // Skip rendering empty assistant messages (streaming not started yet)
  if (!isUser && !message.content) return null

  return (
    <article className={`message-bubble message-bubble--${isUser ? 'user' : 'assistant'}`}>
      {/* ── Meta row ── */}
      <div className="message-bubble__meta">
        <span className="message-bubble__avatar">{isUser ? 'U' : 'AI'}</span>
        <span className="message-bubble__sender">{isUser ? 'You' : 'Sentinel AI'}</span>
        <span className="message-bubble__time">{message.createdAt}</span>
      </div>

      {/* ── Message body ── */}
      <div className="message-bubble__body">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
