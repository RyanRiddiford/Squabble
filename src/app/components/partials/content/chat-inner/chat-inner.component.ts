import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'src/app/types/message';
import { User } from 'src/app/types/user';
import { GetAccountDataService } from 'src/app/services/get-account-data.service';
import { Channel } from '../../../../types/channel';
import { ChatClientService } from '../../../../services/acs-services/chat-client.service';
import { CallClientService } from '../../../../services/acs-services/call-client.service';
import {
  ChatThreadClient,
  SendMessageOptions,
  SendTypingNotificationOptions,
} from '@azure/communication-chat';
import { Post } from 'src/app/types/post';
import { AddPostToDatabaseService } from 'src/app/services/add-post-to-database.service';
import { AzureStorageService } from 'src/app/services/azure-storage.service';

@Component({
  selector: 'app-chat-inner',
  templateUrl: './chat-inner.component.html',
  styleUrls: ['./chat-inner.component.scss'],
})
export class ChatInnerComponent implements OnInit, OnDestroy {
  @Input() channel: Channel | null = null;
  @Input() isDrawer: boolean = false;
  showDrop: boolean = false;
  files: File[] = [];

  @HostBinding('class') class = 'card-body';
  @HostBinding('id') id = this.isDrawer
    ? 'kt_drawer_chat_messenger_body'
    : 'kt_chat_messenger_body';

  @ViewChild('messageInput', { static: true })
  textInput: string = '';
  messages: Array<Message> = [];
  userData: User = new User();
  chatThreadClient: ChatThreadClient | any = null;
  _whoIsTyping: Array<string> = [];
  _someoneIsTyping: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private accountDataService: GetAccountDataService,
    private chatClientService: ChatClientService,
    private callClientService: CallClientService,
    private blobService: AzureStorageService,
    private router: Router,
    private postDatabaseService: AddPostToDatabaseService
  ) {}

  ngOnDestroy(): void {
    this.channel = null;
    this.turnOffHandlers();
  }

  async ngOnInit() {
    await this.setupChatServices();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!changes['channel'].isFirstChange()) {
      await this.getChatThreadClient();
      await this.listMessages();
      await this.scrollToBottom();
    }
  }

  /** allow for submitting of messages by pressing the enter key. */
  async enterKeyDownEvent(event: any) {
    if (event.keyCode === 13 && this.textInput !== '') {
      await this.submitMessage();
      event.preventDefault();
    }
  }

  /** detects when a user is typing in the text area */
  async keyUpEvent(event: any) {
    let options: SendTypingNotificationOptions = {
      senderDisplayName: this.userData.userName,
    };
    this.chatThreadClient.sendTypingNotification(options);
  }

  /** scroll the message window to the bottom */
  private async scrollToBottom() {
    var objDiv = document.getElementById('messageWindow');
    objDiv!.scrollTop = objDiv!.scrollHeight;
  }

  /** submit a message */
  async submitMessage(): Promise<void> {
    const text = this.textInput;
    this.textInput = '';

    const type = 'text';

    let today = new Date();

    const newMessage: Message = {
      createdOn: today,
      id: '',
      message: text,
      sender: {
        id: this.userData.communicationUserId,
        displayName: this.userData.userName,
      },
      threadId: this.channel?.azureChatThreadId ?? '',
      type: type,
      template: false,
      direction: 'out',
    };

    this.addMessage(newMessage);
    this.scrollToBottom();

    let sendMessageRequest = {
      content: text,
    };

    let sendMessageOptions: SendMessageOptions = {
      senderDisplayName: this.userData.userName,
      type: type,
    };

    await this.chatThreadClient.sendMessage(
      sendMessageRequest,
      sendMessageOptions
    );

    // add a copy of the message to database
    this.saveMessageToDatabase(newMessage);
  }

  /** this function will save a messsage to the database */
  private saveMessageToDatabase(newMessage: Message) {
    let post: Post = {
      content: newMessage.message,
      channelId: this.channel.channelId,
      userId: this.userData.accountId,
      timePosted: newMessage.createdOn,
    };

    this.postDatabaseService.addPost(post).subscribe();
  }

  /** push a new message to the messages array */
  addMessage(newMessage: Message): void {
    this.messages.push(newMessage);
    this.changeDetector.detectChanges();
  }

  /** styling for messages sent and received */
  getMessageCssClass(message: Message): string {
    return `p-5 rounded text-dark fw-bold mw-lg-400px bg-light-${
      message.direction === 'in' ? 'info' : 'primary'
    } text-${message.direction === 'in' ? 'start' : 'end'}`;
  }

  showDropZone() {
    if (this.showDrop == false) {
      this.showDrop = true;
    } else this.showDrop = false;
  }

  async onSelect(event: any) {
    this.files.push(...event.addedFiles);

    for (let i = 0; i < this.files.length; i++) {
      let messageURL = '';

      messageURL = await this.blobService.uploadFile(
        this.files[i],
        this.files[i].name,
        () => {}
      );

      await this.submitFileMessage(messageURL);
    }
  }

  async submitFileMessage(messageURL: string): Promise<void> {
    this.textInput = '';

    const type = 'text';

    let today = new Date();

    const newMessage: Message = {
      createdOn: today,
      id: '',
      message: messageURL,
      sender: {
        id: this.userData.communicationUserId,
        displayName: this.userData.userName,
      },
      threadId: this.channel?.azureChatThreadId ?? '',
      type: type,
      template: false,
      direction: 'out',
    };

    this.addMessage(newMessage);
    this.scrollToBottom();

    let sendMessageRequest = {
      content: messageURL,
    };

    let sendMessageOptions: SendMessageOptions = {
      senderDisplayName: this.userData.userName,
      type: type,
    };

    await this.chatThreadClient.sendMessage(
      sendMessageRequest,
      sendMessageOptions
    );

    // add a copy of the message to database
    this.saveMessageToDatabase(newMessage);
  }

  /** setup required services for group chat */
  private async setupChatServices() {
    this.textInput = '';
    this.accountDataService.getCurrentUserData().then(async (data) => {
      this.userData = data;

      await this.getChatThreadClient();
      await this.listMessages();
      await this.scrollToBottom();
      await this.setupHandlers();
    });
  }

  /** set the chat thread client */
  private async getChatThreadClient() {
    this.chatThreadClient =
      this.chatClientService.chatClient.getChatThreadClient(
        this.channel?.azureChatThreadId ?? ''
      );
  }

  /** turn off real-time notifications */
  private async turnOffHandlers() {
    await this.chatClientService.chatClient.stopRealtimeNotifications();
  }

  /** event handler */
  private async setupHandlers() {
    if (this.chatClientService.chatClient) {
      await this.chatClientService.chatClient.startRealtimeNotifications();
      // called when a new message is received.
      this.chatClientService.chatClient.on('chatMessageReceived', (e: any) => {
        if (this.channel?.azureChatThreadId === e.threadId) {
          const newMessage: Message = {
            createdOn: e.createdOn,
            id: e.id,
            message: e.message,
            sender: {
              id: e.sender.communicationUserId,
              displayName: e.senderDisplayName,
            },
            threadId: e.threadId,
            type: e.type,
            template: false,
            direction: 'in',
          };
          // only display message received from others.
          if (
            this.userData.communicationUserId !== e.sender.communicationUserId
          ) {
            this.addMessage(newMessage);
            this.scrollToBottom();
          }
        }
      });
      // detects when typing notification is received.
      this.chatClientService.chatClient.on(
        'typingIndicatorReceived',
        (async (e: any) => {
          if (this.channel?.azureChatThreadId === e.threadId) {
            const user = e.senderDisplayName;

            if (!this._whoIsTyping.find((x) => x === user)) {
              if (user !== this.userData.userName) {
                this._someoneIsTyping = true;
                this._whoIsTyping.push(user);

                await this.delay(8000);

                this._someoneIsTyping = false;
                let index = this._whoIsTyping.indexOf(user);
                this._whoIsTyping.splice(index);
              }
            }
          }
        }).bind(this)
      );
    }
  }
  /** delays code execution */
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** list all messages from a thread */
  async listMessages() {
    this.messages = [];
    const messages = this.chatThreadClient.listMessages();

    for await (const message of messages) {
      if (message.type == 'text') {
        let msg: Message = {
          createdOn: message.createdOn,
          id: message.id,
          message: message.content.message,
          sender: {
            id: message.sender.communicationUserId,
            displayName: message.senderDisplayName,
          },
          threadId: this.channel?.azureChatThreadId ?? '',
          type: message.type,
          template: false,
          direction:
            this.userData.communicationUserId ===
            message.sender.communicationUserId
              ? 'out'
              : 'in',
        };
        this.messages.unshift(msg);
      }
    }
  }

  /** sort the message array to show oldest messages on top */
  // private async sortMessage() {
  //   this.messages.sort(function (a, b) {
  //     return a.createdOn.valueOf() - b.createdOn.valueOf();
  //   });
  // }

  /** Prepare for the call */
  prepareToCall() {
    this.callClientService.callType = 'caller';
    this.router.navigate(['/local-preview']);
  }
}
