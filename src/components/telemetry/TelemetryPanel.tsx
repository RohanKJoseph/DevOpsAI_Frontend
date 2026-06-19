import { ActionButton } from '../actions/ActionButton'
import { JsonViewer } from './JsonViewer'
import { LogViewer } from './LogViewer'
import { MetricsCard } from './MetricsCard'
import { useChat } from '../../hooks/useChat'

export function TelemetryPanel() {
  const { telemetry, actions, executeAction } = useChat()

  return (
    <section className="telemetry-panel">
      <div className="telemetry-panel__header">
        <div className="telemetry-panel__header-row">
          <div>
            <h2>Telemetry Panel</h2>
            <p>Metrics, logs, JSON context, and suggested actions</p>
          </div>
          <span className="status-pill">
            <span className="status-pill__dot" />
            {telemetry.status === 'critical' ? 'Critical' : telemetry.status === 'warning' ? 'Warning' : 'Healthy'}
          </span>
        </div>
      </div>

      <div className="telemetry-panel__sections">
        <div className="telemetry-panel__section">
          <div className="telemetry-panel__section-header">
            <h3>Metrics Cards</h3>
            <p>CPU, memory, and replica status</p>
          </div>
          <div className="telemetry-panel__cards">
            {telemetry.metrics.map((metric) => (
              <MetricsCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>

        <div className="telemetry-panel__section">
          <div className="telemetry-panel__section-header">
            <h3>Action Buttons</h3>
            <p>Suggested remediation steps</p>
          </div>
          <div className="action-group">
            {actions.map((action) => (
              <ActionButton key={action.id} action={action} onClick={executeAction} />
            ))}
          </div>
        </div>

        <LogViewer logs={telemetry.logs} />
        <JsonViewer data={telemetry.context} />
      </div>
    </section>
  )
}
