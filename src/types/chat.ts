export type MessageRole = 'user' | 'assistant'

export type TelemetryStatus = 'healthy' | 'warning' | 'critical'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
}

export interface ConversationSummary {
  id: string
  title: string
  subtitle: string
  active?: boolean
}

export interface MetricSnapshot {
  label: string
  value: string
  hint: string
  trend: string
  status: TelemetryStatus
}

export interface ChatAction {
  id: string
  label: string
  action: string
  description: string
  tone: 'primary' | 'warning' | 'danger'
}

export interface TelemetryData {
  status: TelemetryStatus
  metrics: MetricSnapshot[]
  logs: string[]
  context: Record<string, unknown>
  actions: ChatAction[]
}

export interface ChatResponse {
  response: string
  thoughts: string[]
  telemetry: TelemetryData
  actions: ChatAction[]
}
