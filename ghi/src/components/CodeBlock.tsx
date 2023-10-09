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

interface CodeBlockProps {
  text: string;
  language: string;
  showLineNumbers: boolean;
  theme: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  text,
  language,
  showLineNumbers,
  theme,
}) => {
  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    selectOnLineNumbers: showLineNumbers,
    roundedSelection: false,
    readOnly: true,
    cursorStyle: 'line',
    automaticLayout: true,
    padding: {
      top: 20,
      bottom: 20,
    },
    scrollBeyondLastLine: false,
  };

  return (
    <MonacoEditor
      height="400"
      language={language}
      value={text}
      options={options}
      theme={theme}
    />
  );
};

export default CodeBlock;
