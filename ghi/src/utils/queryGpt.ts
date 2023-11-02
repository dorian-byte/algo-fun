import { OPEN_AI_API_KEY } from './keys';
import OpenAI from 'openai';

export async function getGptResponse({
  setLoading,
  setChadResponse,
  query,
}: any) {
  setLoading(true);
  const openai = new OpenAI({
    apiKey: OPEN_AI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: query,
      },
    ],
    model: 'gpt-3.5-turbo',
  });
  setLoading(false);
  setChadResponse(completion.choices[0]?.message?.content || '');
}
