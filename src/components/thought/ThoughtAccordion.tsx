interface ThoughtAccordionProps {
  thoughts: string[]
  open?: boolean
}

export function ThoughtAccordion({ thoughts, open = true }: ThoughtAccordionProps) {
  return (
    <details className="thought-accordion" open={open}>
      <summary className="thought-accordion__summary">
        <div>
          <strong>Thought Process</strong>
          <p>{open ? '▼ Thinking...' : 'Processing complete'}</p>
        </div>
        <span className="status-pill">
          <span className="status-pill__dot" />
          Live reasoning
        </span>
      </summary>
      <ul className="thought-accordion__list">
        {thoughts.map((thought, index) => (
          <li key={`${thought}-${index}`} className="thought-accordion__item">
            <span className="thought-accordion__icon">✓</span>
            <div>
              <strong>{thought}</strong>
            </div>
          </li>
        ))}
      </ul>
    </details>
  )
}
