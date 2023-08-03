export interface Message {
  createdOn: Date;
  id: string;
  message: string;
  sender: {
    id: string;
    displayName: string;
  };
  threadId: string;
  type: string;
  template: boolean;
  direction: 'in' | 'out';
}
