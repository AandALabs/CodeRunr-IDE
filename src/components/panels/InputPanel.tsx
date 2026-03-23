interface InputPanelProps {
  stdin: string
  expectedOutput: string
  onStdinChange: (value: string) => void
  onExpectedOutputChange: (value: string) => void
}

export function InputPanel({
  stdin,
  expectedOutput,
  onStdinChange,
  onExpectedOutputChange,
}: InputPanelProps) {
  return (
    <section className="panel-card panel-stack">
      <div className="panel-header">
        <h2>Input</h2>
      </div>

      <label className="textarea-group">
        <span>stdin</span>
        <textarea
          value={stdin}
          onChange={(event) => onStdinChange(event.target.value)}
          placeholder="Add stdin for your program"
        />
      </label>

      <label className="textarea-group" style={{ borderTop: '1px solid #30363d' }}>
        <span>Expected Output</span>
        <textarea
          value={expectedOutput}
          onChange={(event) => onExpectedOutputChange(event.target.value)}
          placeholder="Optional expected output for judging"
        />
      </label>
    </section>
  )
}
