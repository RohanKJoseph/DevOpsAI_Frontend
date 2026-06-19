import { create } from 'zustand'
import type {
  ChatAction,
  ChatMessage,
  ConversationSummary,
  TelemetryData,
} from '../types/chat'

interface ChatStore {
  messages: ChatMessage[]
  thoughts: string[]
  telemetry: TelemetryData
  actions: ChatAction[]
  conversations: ConversationSummary[]
  activeConversationId: string
  isThinking: boolean
  setMessages: (messages: ChatMessage[]) => void
  appendMessage: (message: ChatMessage) => void
  updateMessage: (messageId: string, content: string) => void
  setThoughts: (thoughts: string[]) => void
  setTelemetry: (telemetry: TelemetryData) => void
  setActions: (actions: ChatAction[]) => void
  setThinking: (thinking: boolean) => void
  selectConversation: (conversationId: string) => void
  addConversation: (conversation: ConversationSummary) => void
}

const timestamp = () => new Date().toISOString()

const initialTelemetry: TelemetryData = {
  status: 'warning',
  metrics: [
    {
      label: 'CPU',
      value: '78%',
      hint: 'Cluster-wide average',
      trend: '+12% in 15m',
      status: 'warning',
    },
    {
      label: 'Memory',
      value: '4.8 GB',
      hint: 'Working set',
      trend: '+0.9 GB',
      status: 'warning',
    },
    {
      label: 'Pods',
      value: '12 Running',
      hint: 'Deployment replicas',
      trend: '2 pending',
      status: 'healthy',
    },
  ],
  logs: [
    '[15:02:11] nginx 502 returned from upstream',
    '[15:02:17] pod restart detected on api-7df4',
    '[15:02:20] cpu spike correlated with deployment',
  ],
  context: {
    cpu: 78,
    memory: '4.8GB',
    pod: 'api-7df4',
    namespace: 'production',
  },
  actions: [],
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: 'welcome-assistant',
      role: 'assistant',
      content:
        'Ask me about the current cluster health, logs, telemetry, or the next action I should take.',
      createdAt: timestamp(),
    },
  ],
  thoughts: ['Standing by for a signal'],
  telemetry: initialTelemetry,
  actions: [],
  conversations: [
    { id: 'c-1', title: 'CPU Investigation', subtitle: 'High utilization in production' },
    { id: 'c-2', title: 'Memory Leak', subtitle: 'Heap growth on api service' },
    { id: 'c-3', title: 'Pod Crash', subtitle: 'Crash loop on rollout' },
  ],
  activeConversationId: 'c-1',
  isThinking: false,
  setMessages: (messages) => set({ messages }),
  appendMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (messageId, content) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, content } : message,
      ),
    })),
  setThoughts: (thoughts) => set({ thoughts }),
  setTelemetry: (telemetry) => set({ telemetry }),
  setActions: (actions) => set({ actions }),
  setThinking: (thinking) => set({ isThinking: thinking }),
  selectConversation: (conversationId) => set({ activeConversationId: conversationId }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations.filter((item) => item.id !== conversation.id)],
    })),
}))
