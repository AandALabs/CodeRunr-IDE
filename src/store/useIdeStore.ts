import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Language, SubmissionResponse } from '../types/api'
import { getStarterCode } from '../lib/languageMap'

export type EditorTheme = 'vs-dark' | 'vs' | 'hc-black'

type PersistedIdeState = {
  sourceCode: string
  sourceCodeByLanguage: Record<number, string>
  stdin: string
  expectedOutput: string
  selectedLanguageId: number | null
  editorFontSize: number
  editorTheme: EditorTheme
}

interface IdeState {
  languages: Language[]
  selectedLanguageId: number | null
  sourceCode: string
  sourceCodeByLanguage: Record<number, string>
  stdin: string
  expectedOutput: string
  editorFontSize: number
  editorTheme: EditorTheme
  isRunning: boolean
  isLoadingLanguages: boolean
  error: string
  activePanel: 'input' | 'output' | 'details'
  result: SubmissionResponse | null
  setLanguages: (languages: Language[]) => void
  setSelectedLanguageId: (languageId: number) => void
  setSourceCode: (sourceCode: string) => void
  setStdin: (stdin: string) => void
  setExpectedOutput: (expectedOutput: string) => void
  setEditorFontSize: (fontSize: number) => void
  setEditorTheme: (theme: EditorTheme) => void
  resetSourceCode: () => void
  setIsRunning: (isRunning: boolean) => void
  setIsLoadingLanguages: (isLoadingLanguages: boolean) => void
  setError: (error: string) => void
  setActivePanel: (panel: 'input' | 'output' | 'details') => void
  setResult: (result: SubmissionResponse | null) => void
}

export const useIdeStore = create<IdeState>()(
  persist(
    (set, get) => ({
      languages: [],
      selectedLanguageId: null,
      sourceCode: '',
      sourceCodeByLanguage: {},
      stdin: '',
      expectedOutput: '',
      editorFontSize: 15,
      editorTheme: 'vs-dark',
      isRunning: false,
      isLoadingLanguages: false,
      error: '',
      activePanel: 'output',
      result: null,
      setLanguages: (languages) => {
        const currentId = get().selectedLanguageId
        const nextLanguage =
          languages.find((language) => language.id === currentId) ?? languages[0] ?? null

        set((state) => {
          const nextSelectedLanguageId = nextLanguage?.id ?? null
          const nextSourceCode =
            nextSelectedLanguageId === null
              ? ''
              : state.sourceCodeByLanguage[nextSelectedLanguageId] ??
                getStarterCode(nextLanguage?.name ?? '')

          return {
            languages,
            selectedLanguageId: nextSelectedLanguageId,
            sourceCode: nextSourceCode,
            sourceCodeByLanguage:
              nextSelectedLanguageId === null
                ? state.sourceCodeByLanguage
                : {
                    ...state.sourceCodeByLanguage,
                    [nextSelectedLanguageId]: nextSourceCode,
                  },
          }
        })
      },
      setSelectedLanguageId: (languageId) => {
        const currentLanguageId = get().selectedLanguageId
        const nextLanguage = get().languages.find((language) => language.id === languageId)

        set((state) => {
          const nextSourceCode =
            state.sourceCodeByLanguage[languageId] ?? getStarterCode(nextLanguage?.name ?? '')

          return {
            selectedLanguageId: languageId,
            sourceCode: nextSourceCode,
            sourceCodeByLanguage: {
              ...state.sourceCodeByLanguage,
              ...(currentLanguageId !== null ? { [currentLanguageId]: state.sourceCode } : {}),
              [languageId]: nextSourceCode,
            },
          }
        })
      },
      setSourceCode: (sourceCode) =>
        set((state) => ({
          sourceCode,
          sourceCodeByLanguage:
            state.selectedLanguageId === null
              ? state.sourceCodeByLanguage
              : {
                  ...state.sourceCodeByLanguage,
                  [state.selectedLanguageId]: sourceCode,
                },
        })),
      setStdin: (stdin) => set({ stdin }),
      setExpectedOutput: (expectedOutput) => set({ expectedOutput }),
      setEditorFontSize: (editorFontSize) => set({ editorFontSize }),
      setEditorTheme: (editorTheme) => set({ editorTheme }),
      resetSourceCode: () => {
        const currentId = get().selectedLanguageId
        const language = get().languages.find((item) => item.id === currentId)
        const nextSourceCode = language ? getStarterCode(language.name) : ''

        set((state) => ({
          sourceCode: nextSourceCode,
          sourceCodeByLanguage:
            currentId === null
              ? state.sourceCodeByLanguage
              : {
                  ...state.sourceCodeByLanguage,
                  [currentId]: nextSourceCode,
                },
        }))
      },
      setIsRunning: (isRunning) => set({ isRunning }),
      setIsLoadingLanguages: (isLoadingLanguages) => set({ isLoadingLanguages }),
      setError: (error) => set({ error }),
      setActivePanel: (activePanel) => set({ activePanel }),
      setResult: (result) => set({ result }),
    }),
    {
      name: 'coderunr-ide-storage',
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as Partial<PersistedIdeState> | undefined

        return {
          sourceCode: state?.sourceCode ?? '',
          sourceCodeByLanguage: state?.sourceCodeByLanguage ?? {},
          stdin: state?.stdin ?? '',
          expectedOutput: state?.expectedOutput ?? '',
          selectedLanguageId: state?.selectedLanguageId ?? null,
          editorFontSize: state?.editorFontSize ?? 15,
          editorTheme: state?.editorTheme ?? 'vs-dark',
        }
      },
      partialize: (state) => ({
        sourceCode: state.sourceCode,
        sourceCodeByLanguage: state.sourceCodeByLanguage,
        stdin: state.stdin,
        expectedOutput: state.expectedOutput,
        selectedLanguageId: state.selectedLanguageId,
        editorFontSize: state.editorFontSize,
        editorTheme: state.editorTheme,
      }),
    }
  )
)
