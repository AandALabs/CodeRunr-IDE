import { useEffect, useRef } from "react";

import { CodeEditor } from "./components/editor/CodeEditor";
import { RunToolbar } from "./components/controls/RunToolbar";
import { InputPanel } from "./components/panels/InputPanel";
import { OutputPanel } from "./components/panels/OutputPanel";
import { SubmissionDetails } from "./components/panels/SubmissionDetails";
import { IdeShell } from "./components/layout/IdeShell";
import { createSubmission, getLanguages, getSubmission } from "./lib/api";
import { getMonacoLanguage } from "./lib/languageMap";
import { useIdeStore } from "./store/useIdeStore";

const FINAL_STATUSES = new Set([
  "Accepted",
  "Wrong Answer",
  "Compilation Error",
  "Runtime Error (NZEC)",
  "Runtime Error (SIGSEGV)",
  "Runtime Error (SIGXFSZ)",
  "Runtime Error (SIGFPE)",
  "Runtime Error (SIGABRT)",
  "Runtime Error (NZEC)",
  "Time Limit Exceeded",
  "Memory Limit Exceeded",
  "Internal Error",
]);

const POLL_INTERVAL_MS = 1500;
const MAX_POLLS = 20;

function App() {
  const {
    languages,
    selectedLanguageId,
    sourceCode,
    stdin,
    expectedOutput,
    editorFontSize,
    editorTheme,
    isRunning,
    isLoadingLanguages,
    error,
    activePanel,
    result,
    setLanguages,
    setSelectedLanguageId,
    setSourceCode,
    setStdin,
    setExpectedOutput,
    setEditorFontSize,
    setEditorTheme,
    resetSourceCode,
    setIsRunning,
    setIsLoadingLanguages,
    setError,
    setActivePanel,
    setResult,
  } = useIdeStore();

  useEffect(() => {
    let isMounted = true;

    async function loadLanguages() {
      setIsLoadingLanguages(true);
      setError("");

      try {
        const response = await getLanguages();
        if (isMounted) {
          setLanguages(response.data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load languages",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingLanguages(false);
        }
      }
    }

    void loadLanguages();

    return () => {
      isMounted = false;
    };
  }, [setError, setIsLoadingLanguages, setLanguages]);

  const selectedLanguage =
    languages.find((language) => language.id === selectedLanguageId) ?? null;
  const editorLanguage = selectedLanguage
    ? getMonacoLanguage(selectedLanguage.name)
    : "plaintext";
  const editorTitle = selectedLanguage
    ? `${selectedLanguage.name} Playground`
    : "Code Playground";

  async function handleRun() {
    if (!selectedLanguageId || !sourceCode.trim()) {
      setError("Select a language and add some source code first.");
      return;
    }

    setError("");
    setIsRunning(true);
    setActivePanel("output");

    try {
      const created = await createSubmission({
        source_code: sourceCode,
        language_id: selectedLanguageId,
        stdin: stdin || null,
        expected_output: expectedOutput || null,
      });

      setResult(created.data);

      let latest = created.data;
      let pollCount = 0;

      while (!FINAL_STATUSES.has(latest.status) && pollCount < MAX_POLLS) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, POLL_INTERVAL_MS),
        );
        const latestRes = await getSubmission(latest.token);
        latest = latestRes.data;
        setResult(latest);
        pollCount += 1;
      }

      if (!FINAL_STATUSES.has(latest.status)) {
        setError("Execution is still processing. Try again in a moment.");
      }
    } catch (runError) {
      setError(
        runError instanceof Error ? runError.message : "Failed to run code",
      );
    } finally {
      setIsRunning(false);
    }
  }

  const runRef = useRef(handleRun);
  useEffect(() => {
    runRef.current = handleRun;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isRunning) {
          void runRef.current();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isRunning]);

  return (
    <IdeShell
      activePanel={activePanel}
      onActivePanelChange={setActivePanel}
      toolbar={
        <RunToolbar
          languages={languages}
          selectedLanguageId={selectedLanguageId}
          onLanguageChange={setSelectedLanguageId}
          onRun={handleRun}
          isRunning={isRunning}
          isLoadingLanguages={isLoadingLanguages}
        />
      }
      editor={
        <CodeEditor
          key={selectedLanguageId ?? "no-language"}
          language={editorLanguage}
          value={sourceCode}
          theme={editorTheme}
          onChange={setSourceCode}
          title={editorTitle}
          fontSize={editorFontSize}
          onFontSizeChange={setEditorFontSize}
          onThemeChange={setEditorTheme}
          onReset={resetSourceCode}
        />
      }
      input={
        <InputPanel
          stdin={stdin}
          expectedOutput={expectedOutput}
          onStdinChange={setStdin}
          onExpectedOutputChange={setExpectedOutput}
        />
      }
      output={
        <OutputPanel result={result} error={error} isRunning={isRunning} />
      }
      details={<SubmissionDetails result={result} isRunning={isRunning} />}
    />
  );
}

export default App;
