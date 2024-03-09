import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askAi = async (
  prompt: string,
  systemPrompt?: string,
  model?: string,
  max_tokens?: number
) => {
  const messages: ChatCompletionMessageParam[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });
  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: model || 'gpt-4',
    max_tokens: max_tokens || 500,
  });
  return chatCompletion.choices[0].message.content;
};
