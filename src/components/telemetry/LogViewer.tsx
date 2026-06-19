interface LogViewerProps {
  logs: string[]
}

export function LogViewer({ logs }: LogViewerProps) {
  return (
    <div className="log-viewer">
      <div className="telemetry-panel__section-header">
        <h3>Logs Viewer</h3>
        <p>Latest system events</p>
      </div>
      <div className="log-viewer__list">
        {logs.map((entry) => {
          const closing = entry.indexOf(']')
          const time = closing > 0 ? entry.slice(0, closing + 1) : '[now]'
          const message = closing > 0 ? entry.slice(closing + 2) : entry

          return (
            <div key={entry} className="log-viewer__entry">
              <span className="log-viewer__time">{time}</span>
              <span>{message}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
