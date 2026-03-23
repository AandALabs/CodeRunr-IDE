import type { ReactNode } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

interface IdeShellProps {
  toolbar: ReactNode;
  editor: ReactNode;
  input: ReactNode;
  output: ReactNode;
  details: ReactNode;
  activePanel: "input" | "output" | "details";
  onActivePanelChange: (panel: "input" | "output" | "details") => void;
}

export function IdeShell({
  toolbar,
  editor,
  input,
  output,
  details,
  activePanel,
  onActivePanelChange,
}: IdeShellProps) {
  return (
    <div className="app-shell">
      {toolbar}

      <div className="desktop-layout">
        <Group orientation="horizontal" className="workspace-panels">
          <Panel defaultSize={62} minSize={400}>
            <section className="editor-panel">{editor}</section>
          </Panel>

          <Separator className="resize-handle" />

          <Panel defaultSize={38} minSize={30}>
            <Group orientation="vertical">
              <Panel defaultSize={50} minSize={200}>
                {input}
              </Panel>
              <Separator className="resize-handle horizontal" />
              <Panel defaultSize={50} minSize={200}>
                {output}
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>

      <div className="status-bar">{details}</div>

      <div className="mobile-layout">
        <section className="editor-panel mobile-editor">{editor}</section>
        <div className="mobile-tabs">
          <button
            type="button"
            className={
              activePanel === "input" ? "mobile-tab active" : "mobile-tab"
            }
            onClick={() => onActivePanelChange("input")}
          >
            Input
          </button>
          <button
            type="button"
            className={
              activePanel === "output" ? "mobile-tab active" : "mobile-tab"
            }
            onClick={() => onActivePanelChange("output")}
          >
            Output
          </button>
        </div>
        {activePanel === "input" ? input : null}
        {activePanel === "output" ? output : null}
      </div>
    </div>
  );
}
