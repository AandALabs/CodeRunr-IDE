import type { SubmissionResponse } from '../../types/api'

interface SubmissionDetailsProps {
  result: SubmissionResponse | null
  isRunning: boolean
}

function formatMetric(value: string | number | null | undefined) {
  return value ?? '—'
}

export function SubmissionDetails({ result, isRunning }: SubmissionDetailsProps) {
  return (
    <div className="status-bar-content">
      <span><strong>Status:</strong> {isRunning ? 'Running' : formatMetric(result?.status)}</span>
      <span><strong>Time:</strong> {result?.time ? `${result.time}s` : '—'}</span>
      <span><strong>Wall Time:</strong> {result?.wall_time ? `${result.wall_time}s` : '—'}</span>
      <span><strong>Memory:</strong> {result?.memory ? `${(result.memory / 1024).toFixed(2)} MB` : '—'}</span>
      <span><strong>Exit Code:</strong> {formatMetric(result?.exit_code)}</span>
    </div>
  )
}
