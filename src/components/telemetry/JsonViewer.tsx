import { useMemo, useState } from 'react'

interface JsonViewerProps {
  data: Record<string, unknown>
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)
  const json = useMemo(() => JSON.stringify(data, null, 2), [data])

  const copyJson = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="json-viewer">
      <div className="json-viewer__toolbar">
        <div>
          <h3 style={{ margin: 0, fontSize: '15px' }}>JSON Context Viewer</h3>
          <p style={{ margin: '2px 0 0', color: 'var(--muted)', fontSize: '12px' }}>Live telemetry snapshot</p>
        </div>
        <button type="button" onClick={() => void copyJson()}>
          {copied ? 'Copied' : 'Copy JSON'}
        </button>
      </div>
      <pre>{json}</pre>
    </div>
  )
}
