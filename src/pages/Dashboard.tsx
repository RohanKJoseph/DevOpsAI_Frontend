import { useCallback, useRef, useState } from 'react'
import { ChatWindow } from '../components/chat/ChatWindow'
import { TelemetryPanel } from '../components/telemetry/TelemetryPanel'
import { MainLayout } from '../layouts/MainLayout'

const MIN_WIDTH = 260
const MAX_WIDTH = 560
const DEFAULT_WIDTH = 340

export function Dashboard() {
  const [telemetryOpen, setTelemetryOpen] = useState(true)
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH)
  const [dragging, setDragging] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(DEFAULT_WIDTH)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    startXRef.current = e.clientX
    startWidthRef.current = panelWidth
    setDragging(true)

    const onMouseMove = (ev: MouseEvent) => {
      // Moving left = increasing panel width (since handle is on the left edge of the panel)
      const delta = startXRef.current - ev.clientX
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + delta))
      setPanelWidth(next)
    }

    const onMouseUp = () => {
      setDragging(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [panelWidth])

  return (
    <MainLayout
      telemetryOpen={telemetryOpen}
      onToggleTelemetry={() => setTelemetryOpen((v) => !v)}
    >
      {/* Chat takes up all remaining horizontal space */}
      <div className="chat-area">
        <ChatWindow />
      </div>

      {/* Drag handle — only visible when panel is open */}
      {telemetryOpen && (
        <div
          className={`telemetry-resize-handle${dragging ? ' dragging' : ''}`}
          onMouseDown={onMouseDown}
          role="separator"
          aria-label="Resize telemetry panel"
        />
      )}

      {/* Collapsible + resizable telemetry panel */}
      <aside
        className="telemetry-panel"
        data-open={telemetryOpen ? 'true' : 'false'}
        style={{ width: telemetryOpen ? panelWidth : 0 }}
      >
        <div className="telemetry-panel__inner">
          <TelemetryPanel />
        </div>
      </aside>
    </MainLayout>
  )
}
