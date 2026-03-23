import type { SubmissionResponse } from '../../types/api'

interface OutputPanelProps {
  result: SubmissionResponse | null
  error: string
  isRunning: boolean
}

function getPrimaryOutput(result: SubmissionResponse | null, isRunning: boolean) {
  if (isRunning) return 'Running...'
  if (!result) return 'Run your code to see output here.'
  return result.stdout || result.stderr || result.compile_output || result.message || 'Execution finished with no output.'
}

function getOutputLabel(result: SubmissionResponse | null) {
  if (!result) return 'Console'
  if (result.stdout) return 'stdout'
  if (result.stderr) return 'stderr'
  if (result.compile_output) return 'compile output'
  if (result.message) return 'message'
  return 'Console'
}

export function OutputPanel({ result, error, isRunning }: OutputPanelProps) {
  return (
    <section className="panel-card panel-stack">
      <div className="panel-header">
        <h2>Output ({getOutputLabel(result)})</h2>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}

      <pre className="terminal-window">{getPrimaryOutput(result, isRunning)}</pre>
    </section>
  )
}
