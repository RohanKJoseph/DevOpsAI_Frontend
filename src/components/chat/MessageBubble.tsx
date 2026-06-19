import ReactMarkdown from 'react-markdown'
import clsx from 'clsx'
import type { ChatMessage } from '../../types/chat'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <article className={clsx('message-bubble', isUser ? 'message-bubble--user' : 'message-bubble--assistant')}>
      <div className="message-bubble__role">
        <span className="message-bubble__avatar">{isUser ? 'U' : 'AI'}</span>
        <span>{isUser ? 'You' : 'Sentinel AI'}</span>
        <span>{message.createdAt}</span>
      </div>
      <div className="message-bubble__content">
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
