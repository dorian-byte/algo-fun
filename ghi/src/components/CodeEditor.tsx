import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor';

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
  text: string;
  language: string;
  showLineNumbers: boolean;
  theme: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  text,
  language,
  showLineNumbers,
  theme,
}) => {
  const padding = 20;
  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    roundedSelection: false,
    readOnly: true,
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
    text?.split('\n').length * 19 + padding * 2,
    300
  );

  return (
    <MonacoEditor
      height={calculatedHeight + 'px'}
      language={language}
      value={text}
      options={options}
      theme={theme}
    />
  );
};

export default CodeEditor;
