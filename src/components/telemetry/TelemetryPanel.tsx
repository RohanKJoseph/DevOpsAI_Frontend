import { useState } from 'react'
import { ActionButton } from '../actions/ActionButton'
import { Modal } from '../Modal'
import { useChat } from '../../hooks/useChat'

// ─── Types ──────────────────────────────────────────────────────────────────
interface ParsedLog {
  time: string
  message: string
  level: 'info' | 'warn' | 'error'
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseLogs(rawLogs: unknown[]): ParsedLog[] {
  return rawLogs.map((entry) => {
    let time = ''
    let message = ''

    if (typeof entry === 'string') {
      const closing = entry.indexOf(']')
      time    = closing > 0 ? entry.slice(0, closing + 1) : ''
      message = closing > 0 ? entry.slice(closing + 2) : entry
    } else if (entry && typeof entry === 'object') {
      const obj = entry as Record<string, unknown>
      time = `[${String(obj.time ?? 'now')}]`
      const statusBadge = obj.status ? `[${String(obj.status)}] ` : ''
      const actionBadge =
        obj.action && obj.action !== 'no_action' ? `⚡ ${String(obj.action)}  ` : ''
      message = `${statusBadge}${actionBadge}${String(obj.reason ?? JSON.stringify(entry))}`
    }

    const lower = message.toLowerCase()
    const level: ParsedLog['level'] =
      lower.includes('error') || lower.includes('502') || lower.includes('crash') ? 'error' :
      lower.includes('warn') || lower.includes('spike') || lower.includes('restart') ? 'warn' :
      'info'

    return { time, message, level }
  })
}

// ─── Log Modal Content ───────────────────────────────────────────────────────
function LogsView({ logs }: { logs: ParsedLog[] }) {
  if (logs.length === 0) {
    return <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', margin: '40px 0' }}>No log entries.</p>
  }
  return (
    <div className="modal-log-list">
      {logs.map((log, i) => (
        <div key={i} className={`modal-log-entry modal-log-entry--${log.level}`}>
          <span className="modal-log-entry__level">
            {log.level === 'error' ? '✖' : log.level === 'warn' ? '⚠' : '●'}
          </span>
          {log.time && <span className="modal-log-entry__time">{log.time}</span>}
          <span className="modal-log-entry__msg">{log.message}</span>
        </div>
      ))}
    </div>
  )
}

// ─── JSON Modal Content ──────────────────────────────────────────────────────
function JsonView({ data }: { data: Record<string, unknown> }) {
  const [copied, setCopied] = useState(false)
  const text = JSON.stringify(data, null, 2)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="copy-btn" onClick={() => void copy()}>
          {copied ? '✓ Copied' : 'Copy JSON'}
        </button>
      </div>
      <pre className="modal-json-pre">{text}</pre>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function TelemetryPanel() {
  const { telemetry, actions, executeAction } = useChat()
  const [logsOpen, setLogsOpen] = useState(false)
  const [jsonOpen, setJsonOpen]   = useState(false)

  const statusLabel =
    telemetry.status === 'critical' ? 'Critical' :
    telemetry.status === 'warning'  ? 'Warning'  : 'Healthy'

  const statusColor =
    telemetry.status === 'critical' ? '#ef4444' :
    telemetry.status === 'warning'  ? '#f59e0b' : '#22c55e'

  const safeLogs   = Array.isArray(telemetry.logs) ? telemetry.logs : []
  const parsedLogs = parseLogs(safeLogs as unknown[])
  const hasJson    = telemetry.context && Object.keys(telemetry.context).length > 0

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
                    <div
                      className="metric-row__fill"
                      data-status={metric.status}
                      style={{ width: `${width}%` }}
                    />
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

      {/* ── Logs — inline preview + expand button ── */}
      {parsedLogs.length > 0 && (
        <div className="telemetry-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px 8px', borderBottom: '1px solid var(--border)' }}>
            <p className="telemetry-section__title" style={{ padding: 0, borderBottom: 'none' }}>
              Cluster Logs
              <span style={{ marginLeft: 6, color: 'var(--muted-2)', fontWeight: 400 }}>
                ({parsedLogs.length})
              </span>
            </p>
            <button
              type="button"
              className="expand-btn"
              onClick={() => setLogsOpen(true)}
              aria-label="View all logs"
            >
              ⤢ Expand
            </button>
          </div>
          <div className="telemetry-section__body" style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
            <div className="log-list">
              {parsedLogs.slice(0, 5).map((log, i) => (
                <div key={i} className={`log-entry log-entry--${log.level}`}>
                  <span className={`log-dot log-dot--${log.level}`} />
                  {log.time && <span className="log-entry__time">{log.time}</span>}
                  <span className="log-entry__msg">{log.message}</span>
                </div>
              ))}
              {parsedLogs.length > 5 && (
                <button
                  type="button"
                  className="expand-btn"
                  style={{ marginTop: 4, alignSelf: 'flex-start' }}
                  onClick={() => setLogsOpen(true)}
                >
                  +{parsedLogs.length - 5} more…
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── JSON Context — button only ── */}
      {hasJson && (
        <div className="telemetry-section">
          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p className="telemetry-section__title" style={{ padding: 0, borderBottom: 'none' }}>
              JSON Context
            </p>
            <button
              type="button"
              className="expand-btn"
              onClick={() => setJsonOpen(true)}
              aria-label="View JSON context"
            >
              {'{ }'} View JSON
            </button>
          </div>
        </div>
      )}

      {/* ── Logs Modal ── */}
      <Modal open={logsOpen} title={`Cluster Logs (${parsedLogs.length})`} onClose={() => setLogsOpen(false)}>
        <LogsView logs={parsedLogs} />
      </Modal>

      {/* ── JSON Modal ── */}
      <Modal open={jsonOpen} title="JSON Context" onClose={() => setJsonOpen(false)}>
        {hasJson && <JsonView data={telemetry.context} />}
      </Modal>
    </>
  )
}
