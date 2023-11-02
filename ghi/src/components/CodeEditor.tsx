import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor';
import React from 'react';

const customDarkTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'keyword', foreground: '569CD6' },
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
  },
};

monaco.editor.defineTheme('customDark', customDarkTheme);

interface CodeEditorProps {
  readOnly: boolean;
  value: string;
  language: string;
  showLineNumbers?: boolean;
  theme?: string;
  onChange?: (value: string) => void;
  width?: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  readOnly = true,
  value,
  language,
  showLineNumbers = true,
  theme = 'vs-dark',
  onChange,
  width = '100%',
  height = '',
}) => {
  const padding = 20;
  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    roundedSelection: false,
    readOnly: readOnly,
    cursorStyle: 'line',
    automaticLayout: true,
    padding: {
      top: padding,
      bottom: padding,
    },
    scrollBeyondLastLine: false,
    lineNumbers: showLineNumbers ? 'on' : 'off',
    wordWrapOverride1: 'on',
    wrappingIndent: 'none',
  };

  const calculatedHeight = Math.max(
    value?.split('\n').length * 19 + padding * 2,
    300
  );

  return (
    <MonacoEditor
      width={width}
      height={height || calculatedHeight + 'px'}
      language={language}
      value={value}
      options={options}
      theme={theme}
      onChange={onChange}
    />
  );
};

export default CodeEditor;
