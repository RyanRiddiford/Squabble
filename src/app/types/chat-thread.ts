export interface ChatThread {
  createdByName: string;
  createdById: string;
  createdOn: string;
  topic: string;
  id: string;
}

export interface InvitedThread {
  invitedBy: string;
  id: string;
}
