import Editor from '@monaco-editor/react'
import { RotateCcw } from 'lucide-react'

import type { EditorTheme } from '../../store/useIdeStore'

interface CodeEditorProps {
  language: string
  value: string
  theme: EditorTheme
  onChange: (value: string) => void
  title: string
  fontSize: number
  onFontSizeChange: (fontSize: number) => void
  onThemeChange: (theme: EditorTheme) => void
  onReset: () => void
}

const themeOptions = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'vs', label: 'Light' },
  { value: 'hc-black', label: 'High Contrast' },
] satisfies ReadonlyArray<{ value: EditorTheme; label: string }>

export function CodeEditor({
  language,
  value,
  theme,
  onChange,
  title,
  fontSize,
  onFontSizeChange,
  onThemeChange,
  onReset,
}: CodeEditorProps) {
  return (
    <div className="editor-shell">
      <div className="panel-header editor-header" style={{ justifyContent: 'space-between' }}>
        <h2>{title}</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value as EditorTheme)}
            title="Editor theme"
            style={{
              background: '#161b22', color: '#c9d1d9', border: '1px solid #30363d',
              borderRadius: '4px', padding: '2px 6px', fontSize: '11px', outline: 'none', cursor: 'pointer'
            }}
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select 
            value={fontSize} 
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            title="Editor font size"
            style={{ 
              background: '#161b22', color: '#c9d1d9', border: '1px solid #30363d', 
              borderRadius: '4px', padding: '2px 6px', fontSize: '11px', outline: 'none', cursor: 'pointer' 
            }}
          >
            {[12, 13, 14, 15, 16, 18, 20, 24].map((size) => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
          <button 
            type="button" 
            onClick={onReset} 
            title="Reset code to default stub"
            style={{ 
              background: 'transparent', color: '#c9d1d9', border: 'none', 
              display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '2px' 
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <div className="editor-wrapper">
        <Editor
          height="100%"
          language={language}
          value={value}
          theme={theme}
          onChange={(nextValue) => onChange(nextValue ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            padding: { top: 20 },
            roundedSelection: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}
