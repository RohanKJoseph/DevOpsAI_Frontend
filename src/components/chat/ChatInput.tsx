import { useState } from 'react'

interface ChatInputProps {
  onSubmit: (message: string) => void | Promise<void>
  disabled?: boolean
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState('Why is CPU high?')

  const submit = async () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) {
      return
    }

    setValue('')
    await onSubmit(trimmed)
  }

  return (
    <div className="chat-input">
      <div className="chat-input__field">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void submit()
            }
          }}
          placeholder="Describe the issue, ask for telemetry, or request an action..."
          aria-label="Chat input"
        />
        <div className="chat-input__toolbar">
          <span className="chat-input__hint">Shift + Enter for a new line</span>
          <button type="button" className="chat-input__send" onClick={() => void submit()} disabled={disabled}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
