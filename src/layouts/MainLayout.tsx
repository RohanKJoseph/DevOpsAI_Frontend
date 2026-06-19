import type { PropsWithChildren } from 'react'

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <div className="dashboard-frame">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__brand">
            <div className="dashboard-topbar__mark">S</div>
            <div>
              <h1>Sentinel AI</h1>
              <p>Operate the cluster from a single chat surface</p>
            </div>
          </div>
          <div className="status-badge">
            <span className="status-badge__dot" />
            Live stream connected
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
