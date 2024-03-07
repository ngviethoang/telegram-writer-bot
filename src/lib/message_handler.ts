import { sendMessage } from '@/lib/telegram';
import { randomWordGenerator } from './random_word';
import {
  createNewPage,
  getCurrentPage,
  getCurrentPageContent,
  updateMessageToCurrentPage,
} from './notion_handler';
import { askAi } from './ai_utils';

export const onStart = async (senderId: string) => {
  const page = await createNewPage('');
  if (!page) {
    await sendMessage(senderId, 'Sorry, I cannot create a new page.');
    return;
  }
  await sendMessage(senderId, 'Start your writing.');
};

export const onRandom = async (senderId: string, randNum: number) => {
  const randomWords = randomWordGenerator(randNum, 'all_words');

  const page = await createNewPage(`Words: ${randomWords.join(', ')}`);
  if (!page) {
    await sendMessage(senderId, 'Sorry, I cannot create a new page.');
    return;
  }

  await sendMessage(
    senderId,
    `Start your writing with these words: *${randomWords.join(', ')}*`,
    'MarkdownV2'
  );
};

export const onSuggest = async (senderId: string) => {
  const currentPageContent = await getCurrentPageContent();
  if (!currentPageContent) {
    await sendMessage(senderId, 'No content found.');
    return;
  }
  const prompt = `Give me some short suggestions for the content: ${currentPageContent}`;
  const response = await askAi(prompt);

  if (!response) {
    await sendMessage(senderId, 'Sorry. I cannot provide any suggestions.');
    return;
  }
  await sendMessage(senderId, response);
};

export const onHelp = async (senderId: string) => {
  await sendMessage(senderId, 'Help');
};

export const onCurrentPage = async (senderId: string) => {
  const currentPage = await getCurrentPage();
  if (!currentPage) {
    await sendMessage(senderId, 'No page found.');
    return;
  }
  await sendMessage(
    senderId,
    `https://notion.so/${currentPage.id.replace(/-/g, '')}`
  );
};

export const onAskingWord = async (senderId: string, word: string) => {
  const prompt = `What is the meaning of ${word}? Give me some examples.`;
  const response = await askAi(prompt);

  if (!response) {
    await sendMessage(senderId, 'Sorry, I cannot find the meaning.');
    return;
  }
  await sendMessage(senderId, response);
};

export const onFindingWord = async (senderId: string, content: string) => {
  const prompt = `Help me find some words that have similar meaning as: ${content}?`;
  const response = await askAi(prompt);

  if (!response) {
    await sendMessage(
      senderId,
      'Sorry, I cannot find the words. Please try again later'
    );
    return;
  }
  await sendMessage(senderId, response);
};

export const onMessage = async (senderId: string, message: string) => {
  await updateMessageToCurrentPage(message);
};
