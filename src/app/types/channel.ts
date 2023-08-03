export interface Channel {
  channelId: number;
  channelName: string;
  azureChatThreadId: string;
  conversationId: number;
  canAccess?: boolean;
}
