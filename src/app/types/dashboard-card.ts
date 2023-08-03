import { ChatThread } from './chat-thread';

export interface StandardCard {
  groupName: string;
  content: string;
  thread: ChatThread;
  cols: 1;
  rows: 1;
}
