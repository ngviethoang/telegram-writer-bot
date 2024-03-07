import {
  onAskingWord,
  onCurrentPage,
  onFindingWord,
  onHelp,
  onMessage,
  onRandom,
  onStart,
  onSuggest,
} from '@/lib/message_handler';
import { sendMessage } from '@/lib/telegram';
import { NextResponse, NextRequest } from 'next/server';

// webhook event handler
export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(JSON.stringify(body, null, 2));

  // send back a response// extract sender's ID
  const senderId = body.message.from.id;

  // // extract the message
  const message: string = body.message.text;
  // console.log('message', message);

  if (message.startsWith('/')) {
    const arr = message.split(' ');
    const command = arr[0].slice(1);
    const args = arr.slice(1).join(' ').trim();

    switch (command) {
      case 'start':
        await onStart(senderId);
        break;
      case 'random':
        const randNum = parseInt(args);
        if (isNaN(randNum)) {
          await sendMessage(senderId, 'Invalid number');
          break;
        }
        await onRandom(senderId, randNum);
        break;
      case 'suggest':
        await onSuggest(senderId);
        break;
      case 'help':
        await onHelp(senderId);
        break;
      case 'page':
        await onCurrentPage(senderId);
        break;
      case 'word':
        await onAskingWord(senderId, args);
        break;
      case 'find':
        await onFindingWord(senderId, args);
        break;
      default:
        await sendMessage(senderId, 'Invalid command. Type /help for help.');
        break;
    }
  } else {
    await onMessage(senderId, message);
  }

  return NextResponse.json({ message: 'Hello World' }, { status: 200 });
}
