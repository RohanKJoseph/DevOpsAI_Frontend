import axios from 'axios'
import type { ChatAction, TelemetryData } from '../types/chat'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
})

export interface ExecuteResult {
  message: string
  telemetryPatch: Partial<TelemetryData>
}

export async function executeApi(action: ChatAction): Promise<ExecuteResult> {
  try {
    // POST to /api/execute with the action command
    const response = await apiClient.post<{
      message: string
      telemetry_patch?: Partial<TelemetryData>
    }>('/api/execute', {
      action: action.action,
      description: action.description,
    })

    const { message, telemetry_patch } = response.data

    return {
      message,
      telemetryPatch: telemetry_patch || {},
    }
  } catch (error) {
    console.error('Execute API error:', error)
    throw new Error(
      error instanceof axios.AxiosError
        ? `Backend error: ${error.response?.status} - ${error.message}`
        : 'Failed to execute action',
    )
  }
}
