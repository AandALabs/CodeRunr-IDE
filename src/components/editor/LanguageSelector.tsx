import type { Language } from '../../types/api'

interface LanguageSelectorProps {
  languages: Language[]
  value: number | null
  onChange: (languageId: number) => void
  disabled?: boolean
}

export function LanguageSelector({ languages, value, onChange, disabled }: LanguageSelectorProps) {
  return (
    <select
      className="select-control"
      value={value ?? ''}
      onChange={(event) => onChange(Number(event.target.value))}
      disabled={disabled || languages.length === 0}
    >
      {languages.length === 0 ? <option value="">Loading languages...</option> : null}
      {languages.map((language) => (
        <option key={language.id} value={language.id}>
          {language.name}
        </option>
      ))}
    </select>
  )
}
