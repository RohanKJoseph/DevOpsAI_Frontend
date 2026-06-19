import { MessageBubble } from './MessageBubble'
import { PromptChips } from './PromptChips'
import { ChatInput } from './ChatInput'
import { ThoughtAccordion } from '../thought/ThoughtAccordion'
import { useChat } from '../../hooks/useChat'

const promptSuggestions = [
  'Why is CPU high?',
  'Show me the pod logs',
  'Scale to 3 replicas',
  'Clear cache safely',
]

export function ChatWindow() {
  const { messages, thoughts, isThinking, sendMessage, recentConversations, selectConversation } = useChat()

  return (
    <section className="chat-window">
      <div className="chat-window__header">
        <div className="chat-window__header-row">
          <div>
            <h2>Chat Window</h2>
            <p>Streaming assistant responses with embedded telemetry context</p>
          </div>
          <span className="status-pill">
            <span className="status-pill__dot" />
            Live monitoring
          </span>
        </div>
      </div>

      <div className="dashboard-history" aria-label="Recent conversations">
        {recentConversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            className="conversation-card"
            data-active={conversation.active ? 'true' : 'false'}
            onClick={() => selectConversation(conversation.id)}
          >
            <div className="conversation-card__title">{conversation.title}</div>
            <div className="conversation-card__subtitle">{conversation.subtitle}</div>
          </button>
        ))}
      </div>

      <div className="chat-window__messages">
        <ThoughtAccordion thoughts={thoughts} open={isThinking} />

        <div className="message-stream">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>

      <PromptChips prompts={promptSuggestions} onPromptSelect={(prompt) => void sendMessage(prompt)} />
      <ChatInput onSubmit={sendMessage} disabled={isThinking} />
    </section>
  )
}
