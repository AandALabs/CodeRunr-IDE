import { LoaderCircle, Play } from 'lucide-react'

import { LanguageSelector } from '../editor/LanguageSelector'
import type { Language } from '../../types/api'

interface RunToolbarProps {
  languages: Language[]
  selectedLanguageId: number | null
  onLanguageChange: (languageId: number) => void
  onRun: () => void
  isRunning: boolean
  isLoadingLanguages: boolean
}

export function RunToolbar({
  languages,
  selectedLanguageId,
  onLanguageChange,
  onRun,
  isRunning,
  isLoadingLanguages,
}: RunToolbarProps) {
  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-brand">
          <div className="brand-logomark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <span className="brand-text">CodeRunr</span>
        </div>
      </div>

      <div className="toolbar-center">
        <LanguageSelector
          languages={languages}
          value={selectedLanguageId}
          onChange={onLanguageChange}
          disabled={isLoadingLanguages || isRunning}
        />
        <button
          type="button"
          className="run-button"
          onClick={onRun}
          disabled={isRunning || isLoadingLanguages || !selectedLanguageId}
        >
          {isRunning ? <LoaderCircle className="spin" size={16} /> : <Play size={16} fill="currentColor" />}
          Run
        </button>
      </div>

    </header>
  )
}
