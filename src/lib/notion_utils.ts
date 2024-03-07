import { Client } from '@notionhq/client';
import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints';

const client = new Client({ auth: process.env.NOTION_API_KEY });

export const createPage = async (database_id: string, title: string) => {
  const response = await client.pages.create({
    parent: {
      database_id,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
    },
  });

  return response;
};

export const queryDatabase = async (
  database_id: string,
  filter: any,
  sorts: any
) => {
  const response = await client.databases.query({
    database_id,
    filter,
    sorts,
  });

  return response;
};

export const appendBlockChildren = async (
  block_id: string,
  children: BlockObjectRequest[]
) => {
  const response = await client.blocks.children.append({
    block_id,
    children,
  });

  return response;
};

export const retrieveBlockChildren = async (block_id: string) => {
  const response = await client.blocks.children.list({
    block_id,
  });

  return response;
};
