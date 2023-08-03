interface MessageModel {
  user: number;
  type: 'in' | 'out';
  text: string;
  time: string;
  template?: boolean;
}

const defaultMessages: Array<MessageModel> = [
  {
    user: 4,
    type: 'in',
    text: 'This is sample text to reflect the status of the build?',
    time: '2 mins',
  },
  {
    user: 2,
    type: 'out',
    text: 'This is sample text to reflect the status of the build?',
    time: '5 mins',
  },
  {
    user: 4,
    type: 'in',
    text: 'Ok, Understood!',
    time: '1 Hour',
  },
  {
    user: 4,
    type: 'in',
    text: 'Company BBQ to celebrate the last quater achievements and goals. Food and drinks provided',
    time: '5 Hours',
  },
  {
    template: true,
    user: 2,
    type: 'out',
    text: '',
    time: 'Just now',
  },
  {
    template: true,
    user: 4,
    type: 'in',
    text: 'Right before vacation season we have the next Big Deal for you.',
    time: 'Just now',
  },
];

interface UserInfoModel {
  initials?: {
    label: string;
    state: 'warning' | 'danger' | 'primary' | 'success' | 'info';
  };
  name: string;
  avatar?: string;
  email: string;
  position: string;
  online: boolean;
}

const defaultUserInfos: Array<UserInfoModel> = [
  {
    name: 'Melody Macy',
    initials: { label: 'M', state: 'danger' },
    email: 'melody@altbox.com',
    position: 'Marketing Analytic',
    online: true,
  },

  {
    name: 'Mikaela Collins',
    initials: { label: 'M', state: 'warning' },
    email: 'mikaela@pexcom.com',
    position: 'Head Of Marketing',
    online: true,
  },
  

  {
    name: 'Olivia Wild',
    initials: { label: 'O', state: 'danger' },
    email: 'olivia@corpmail.com',
    position: 'System Admin',
    online: true,
  },
  {
    name: 'Neil Owen',
    initials: { label: 'N', state: 'primary' },
    email: 'owen.neil@gmail.com',
    position: 'Account Manager',
    online: true,
  },
  {
    name: 'Emma Bold',
    initials: { label: 'E', state: 'danger' },
    email: 'emma@intenso.com',
    position: 'Corporate Finance',
    online: true,
  },
];

const messageFromClient: MessageModel = {
  user: 4,
  type: 'in',
  text: 'Cheers buddy!',
  time: 'Just now',
};

export {
  MessageModel,
  defaultMessages,
  UserInfoModel,
  defaultUserInfos,
  messageFromClient,
};
