import clsx from 'clsx'
import type { MetricSnapshot } from '../../types/chat'

interface MetricsCardProps {
  metric: MetricSnapshot
}

export function MetricsCard({ metric }: MetricsCardProps) {
  const numericValue = Number.parseInt(metric.value, 10)
  const width = Number.isNaN(numericValue) ? 72 : Math.min(100, numericValue)

  return (
    <article className="metrics-card">
      <div className="metrics-card__meta">
        <div className="metrics-card__label">{metric.label}</div>
        <div className="metrics-card__delta">{metric.trend}</div>
      </div>
      <div className="metrics-card__value">{metric.value}</div>
      <div className="metrics-card__hint">{metric.hint}</div>
      <div className="metrics-card__bar">
        <div
          className={clsx('metrics-card__fill')}
          data-status={metric.status}
          style={{ width: `${width}%` }}
        />
      </div>
    </article>
  )
}
