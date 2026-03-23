const templateByLanguage: Record<string, string> = {
  javascript: `function solve() {
  console.log("Hello from CodeRunr IDE");
}

solve();
`,
  typescript: `function solve(): void {
  console.log("Hello from CodeRunr IDE");
}

solve();
`,
  python: `def solve():
    print("Hello from CodeRunr IDE")

solve()
`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from CodeRunr IDE");
    }
}
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from CodeRunr IDE" << endl;
    return 0;
}
`,
  c: `#include <stdio.h>

int main() {
    printf("Hello from CodeRunr IDE\\n");
    return 0;
}
`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello from CodeRunr IDE")
}
`,
  rust: `fn main() {
    println!("Hello from CodeRunr IDE");
}
`,
}

const monacoAliasMap: Record<string, string> = {
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  python: 'python',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  'c++': 'cpp',
  c: 'c',
  go: 'go',
  golang: 'go',
  rust: 'rust',
}

function normalizeLanguageName(name: string) {
  const baseName = name.split('(')[0].trim().toLowerCase()
  return monacoAliasMap[baseName] || baseName
}

export function getMonacoLanguage(name: string) {
  return normalizeLanguageName(name) || 'plaintext'
}

export function getStarterCode(name: string) {
  const normalized = normalizeLanguageName(name)
  return templateByLanguage[normalized] ?? '// Start coding here'
}
