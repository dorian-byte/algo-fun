import { useState } from 'react';
import OpenAI from 'openai';
import { InputBase, LinearProgress } from '@mui/material';
import CodeEditor from '../components/CodeEditor';
import { OPEN_AI_API_KEY } from '../utils/keys';

const TestPage = () => {
  const openai = new OpenAI({
    apiKey: OPEN_AI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chadCompletion, setChadCompletion] = useState<any>({});
  async function getGptResponse() {
    setLoading(true);
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: query,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    setLoading(false);

    console.log('completion', completion);
    setChadCompletion(completion);
  }

  return (
    <div className="container">
      <h1>Test Page</h1>
      <InputBase
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ width: '100%' }}
      />
      <button
        onClick={async () => {
          getGptResponse();
        }}
      >
        ASK GPT
      </button>
      {loading && <LinearProgress />}
      <CodeEditor
        height="300px"
        value={
          chadCompletion?.choices &&
          chadCompletion?.choices[0]?.message?.content
        }
        language="markdown"
        showLineNumbers={false}
        theme="vs-dark"
        readOnly={true}
      />
      <button onClick={() => setChadCompletion({})}>clear</button>
    </div>
  );
};

export default TestPage;
