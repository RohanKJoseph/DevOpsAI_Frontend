import { useState } from 'react'
import { ActionButton } from '../actions/ActionButton'
import { useChat } from '../../hooks/useChat'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button type="button" className="copy-btn" onClick={() => void copy()}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

export function TelemetryPanel() {
  const { telemetry, actions, executeAction } = useChat()

  const statusLabel =
    telemetry.status === 'critical' ? 'Critical' :
    telemetry.status === 'warning'  ? 'Warning'  : 'Healthy'

  const statusColor =
    telemetry.status === 'critical' ? '#ef4444' :
    telemetry.status === 'warning'  ? '#f59e0b' : '#22c55e'

  const jsonText = JSON.stringify(telemetry.context, null, 2)

  // Normalise log entries to { time, message } objects
  const safeLogs = Array.isArray(telemetry.logs) ? telemetry.logs : []
  const parsedLogs = safeLogs.map((entry) => {
    if (typeof entry === 'string') {
      const closing = entry.indexOf(']')
      return {
        time: closing > 0 ? entry.slice(0, closing + 1) : '',
        message: closing > 0 ? entry.slice(closing + 2) : entry,
      }
    }
    if (entry && typeof entry === 'object') {
      const obj = entry as Record<string, unknown>
      const statusBadge = obj.status ? `[${String(obj.status)}] ` : ''
      const actionBadge = obj.action && obj.action !== 'no_action' ? `⚡(${String(obj.action)}) ` : ''
      return {
        time: `[${String(obj.time ?? 'now')}]`,
        message: `${statusBadge}${actionBadge}${String(obj.reason ?? JSON.stringify(entry))}`,
      }
    }
    return { time: '', message: String(entry) }
  })

  return (
    <>
      {/* ── Panel header ── */}
      <div className="telemetry-panel__header">
        <h2 className="telemetry-panel__title">Telemetry</h2>
        <span className="status-pill">
          <span className="status-pill__dot" style={{ background: statusColor }} />
          {statusLabel}
        </span>
      </div>

      {/* ── Metrics ── */}
      {telemetry.metrics?.length > 0 && (
        <div className="telemetry-section">
          <p className="telemetry-section__title">Live Metrics</p>
          <div className="telemetry-section__body">
            {telemetry.metrics.map((metric) => {
              const numericValue = Number.parseInt(metric.value, 10)
              const width = Number.isNaN(numericValue) ? 72 : Math.min(100, numericValue)
              const valueColor =
                metric.status === 'critical' ? '#ef4444' :
                metric.status === 'warning'  ? '#f59e0b' : '#22c55e'

              return (
                <div key={metric.label} className="metric-row">
                  <div className="metric-row__top">
                    <span className="metric-row__label">{metric.label}</span>
                    <span className="metric-row__value" style={{ color: valueColor }}>
                      {metric.value}
                    </span>
                  </div>
                  <div className="metric-row__bar">
                    <div className="metric-row__fill" data-status={metric.status} style={{ width: `${width}%` }} />
                  </div>
                  {metric.hint && <span className="metric-row__hint">{metric.hint}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Suggested Actions ── */}
      {actions?.length > 0 && (
        <div className="telemetry-section">
          <p className="telemetry-section__title">Suggested Actions</p>
          <div className="telemetry-section__body">
            <div className="action-group">
              {actions.map((action) => (
                <ActionButton key={action.id} action={action} onClick={executeAction} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Logs ── */}
      {parsedLogs.length > 0 && (
        <div className="telemetry-section">
          <p className="telemetry-section__title">Cluster Logs</p>
          <div className="telemetry-section__body">
            <div className="log-list">
              {parsedLogs.map((log, i) => (
                <div key={i} className="log-entry">
                  {log.time && <span className="log-entry__time">{log.time}</span>}
                  <span className="log-entry__msg">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── JSON Context ── */}
      {telemetry.context && Object.keys(telemetry.context).length > 0 && (
        <div className="telemetry-section">
          <p className="telemetry-section__title">JSON Context</p>
          <div className="telemetry-section__body">
            <CopyButton text={jsonText} />
            <pre className="json-pre">{jsonText}</pre>
          </div>
        </div>
      )}
    </>
  )
}
