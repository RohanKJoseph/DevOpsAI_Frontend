interface PromptChipsProps {
  prompts: string[]
  onPromptSelect: (prompt: string) => void
}

export function PromptChips({ prompts, onPromptSelect }: PromptChipsProps) {
  return (
    <div className="prompt-chips" aria-label="Suggested prompts">
      {prompts.map((prompt) => (
        <button key={prompt} type="button" className="prompt-chip" onClick={() => onPromptSelect(prompt)}>
          {prompt}
        </button>
      ))}
    </div>
  )
}
