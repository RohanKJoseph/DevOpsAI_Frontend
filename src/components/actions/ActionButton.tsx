import clsx from 'clsx'
import type { ChatAction } from '../../types/chat'

interface ActionButtonProps {
  action: ChatAction
  onClick: (action: ChatAction) => void | Promise<void>
}

const iconMap: Record<ChatAction['tone'], string> = {
  primary: '⟳',
  warning: '↗',
  danger: '!',
}

export function ActionButton({ action, onClick }: ActionButtonProps) {
  return (
    <button type="button" className="action-button" onClick={() => void onClick(action)}>
      <span
        className={clsx('action-button__icon', {
          'action-button__icon--primary': action.tone === 'primary',
          'action-button__icon--warning': action.tone === 'warning',
          'action-button__icon--danger': action.tone === 'danger',
        })}
      >
        {iconMap[action.tone]}
      </span>
      <span>
        <strong>{action.label}</strong>
        <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{action.description}</div>
      </span>
    </button>
  )
}
