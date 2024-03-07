import {
  appendBlockChildren,
  createPage,
  queryDatabase,
  retrieveBlockChildren,
} from './notion_utils';

const database_id = process.env.NOTION_NOTES_DATABASE_ID || '';

export const getCurrentPage = async () => {
  const response = await queryDatabase(database_id, undefined, [
    { property: 'Created time', direction: 'descending' },
  ]);
  return response.results.length > 0 ? response.results[0] : null;
};

export const createNewPage = async (title: string) => {
  return await createPage(database_id, title);
};

export const updateMessageToCurrentPage = async (message: string) => {
  let currentPage = await getCurrentPage();
  if (!currentPage) {
    currentPage = await createNewPage('');
  }

  const block_id = currentPage.id;
  const children = [
    {
      paragraph: {
        rich_text: [
          {
            text: {
              content: message,
            },
          },
        ],
      },
    },
  ];

  await appendBlockChildren(block_id, children);
  return true;
};

export const getCurrentPageContent = async () => {
  let currentPage = await getCurrentPage();
  if (!currentPage) {
    return null;
  }

  const block_id = currentPage.id;
  const response = await retrieveBlockChildren(block_id);
  return response.results
    .map((result: any) => result.paragraph.rich_text[0].text.content)
    .join('\n');
};
