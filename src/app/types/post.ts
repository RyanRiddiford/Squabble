export interface Post {
  content: string;
  channelId: number;
  userId: number;
  timePosted: Date;
  expiresOn?: Date;
}
