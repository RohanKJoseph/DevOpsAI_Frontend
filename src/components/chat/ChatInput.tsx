import { useRef, useState } from 'react'

interface ChatInputProps {
  onSubmit: (message: string) => void | Promise<void>
  disabled?: boolean
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }

  const submit = async () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    setValue('')
    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await onSubmit(trimmed)
  }

  return (
    <div className="chat-input">
      <textarea
        ref={textareaRef}
        value={value}
        rows={1}
        onChange={(e) => {
          setValue(e.target.value)
          autoResize()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void submit()
          }
        }}
        placeholder="Ask Sentinel AI anything about your cluster..."
        aria-label="Chat input"
        disabled={disabled}
      />

      <button
        type="button"
        className="chat-input__send"
        onClick={() => void submit()}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        ↑
      </button>
    </div>
  )
}
