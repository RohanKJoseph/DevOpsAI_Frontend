import type { PropsWithChildren } from 'react'

interface MainLayoutProps extends PropsWithChildren {
  telemetryOpen: boolean
  onToggleTelemetry: () => void
}

export function MainLayout({ children, telemetryOpen, onToggleTelemetry }: MainLayoutProps) {
  return (
    <div className="app-shell">
      {/* ── Top Bar ── */}
      <header className="topbar">
        <div className="topbar__brand">
          <div className="topbar__mark">S</div>
          <div>
            <h1 className="topbar__title">Sentinel AI</h1>
            <p className="topbar__sub">Operate your cluster from a single chat surface</p>
          </div>
        </div>

        <div className="topbar__right">
          <div className="live-badge">
            <span className="live-badge__dot" />
            Live
          </div>

          <button
            type="button"
            className="telemetry-toggle-btn"
            data-active={telemetryOpen ? 'true' : 'false'}
            onClick={onToggleTelemetry}
            aria-label="Toggle telemetry panel"
          >
            📊 Telemetry
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="app-body">
        {children}
      </div>
    </div>
  )
}
