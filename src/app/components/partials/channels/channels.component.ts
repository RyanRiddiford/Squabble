import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CreateGroupDialogComponent } from '../../create-group-dialog/create-group-dialog.component';
import { Channel } from '../../../types/channel';
import { User } from '../../../types/user';
import { GetAccountDataService } from '../../../services/get-account-data.service';
import { ChatClientService } from '../../../services/acs-services/chat-client.service';
import { CallClientService } from '../../../services/acs-services/call-client.service';
import { ChannelService } from '../../../services/squabble-channel.service';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {
  @Input() serverId: number | null = null;
  @Output() selectedChannel = new EventEmitter<Channel>();

  faSpinner = faSpinner;
  addingNewChannel: boolean = false;
  channels: Channel[] = [];
  userData: User = new User();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private getAccountDataService: GetAccountDataService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private http: HttpClient,
    private chatClientService: ChatClientService,
    private callClientService: CallClientService,
    private channelService: ChannelService,
    private squabbleChannelService: ChannelService,
    private notification: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.initChannelsComponent();
  }

  private getChannels() {
    this.channelService.getUserChannelsForServer(this.serverId).subscribe(async (channels) => {
      this.channels = [];

      for (const channel of channels) {
        if (await this.chatClientService.userHasAccessToThread(channel.azureChatThreadId)) {
          channel.canAccess = true;
          this.channels.push(channel);
        } else {
          channel.canAccess = false;
          this.channels.push(channel);
        }
      }
    })
  }

  /** event handlers */
  private setupHandlers() {
    this.chatClientService.chatClient.startRealtimeNotifications().then(() => {
      // called when a new participant is added to a chat thread.
      this.chatClientService.chatClient.on('participantsAdded', async (e: any) => {
          for (const p of e.participantsAdded) {
            if (e.addedBy.id.communicationUserId !== this.userData.communicationUserId) {
              this.channelService.getByThreadId(e.threadId).subscribe(async (data: any) => {
                await this.getChannels();
                const msg = `${e.addedBy.displayName} added you to channel ${data.channelName}`;
                this.openNotification(msg, 'add');
              });
            }
          }
        }
      );

      // called when a  participant is removed from a chat thread.
      this.chatClientService.chatClient.on('participantsRemoved', (e: any) => {
        for (const p of e.participantsRemoved) {
          if (e.removedBy.id.communicationUserId !== this.userData.communicationUserId) {
            this.channelService.getByThreadId(e.threadId).subscribe(async (data: any) => {
              await this.getChannels();
              const msg = `${e.removedBy.displayName} removed you from channel ${data.channelName}`;
              this.openNotification(msg, 'remove');
            });
          }
        }
      });
    });
  }

  /** setup services for thread creation. */
  private initChannelsComponent() {
    // get account data for the logged in user.
    this.getAccountDataService.getCurrentUserData().then((data) => {
      this.userData = data;

      this.setupHandlers();
      this.getChannels();
    });
  }

  /** opens a dialog to get group name, then creates a new group using the name */
  createGroup() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(
      CreateGroupDialogComponent,
      
      {panelClass: 'custom-dialog-container'}
    );
    // todo: user input needs validation and sanitisation
    dialogRef.afterClosed().subscribe(async (data: any) => {
      if (data != undefined) {
        await this.createThread(data['groupName']);
      }
    });
  }

  /** creates a new chat thread then return the id */
  private async createThread(topic: string) {
    this.addingNewChannel = true;
    let createChatThreadRequest = {
      topic: topic,
    };

    let createChatThreadOptions = {
      participants: [
        {
          displayName: this.userData.userName,
          id: { communicationUserId: this.userData.communicationUserId },
        },
      ],
    };

    let createChatThreadResult =
      await this.chatClientService.chatClient.createChatThread(
        createChatThreadRequest,
        createChatThreadOptions
      );

    this.squabbleChannelService
      .createChannel(
        this.serverId,
        topic,
        createChatThreadResult.chatThread!.id
      )
      .subscribe(async () => {
        // Reload channels list.
        await this.getChannels();
        this.addingNewChannel = false;
      });
  }

  emitSelectedChannel(channel: Channel) {
    this.selectedChannel.emit(channel);

    this.callClientService.isFriendCall = false;
    this.callClientService.channelId = channel.channelId;
  }

  openNotification(message: string, type: string) {
    this.notification.open(message, '',
      {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: [type === 'add' ? 'confirm-notification' : 'error-notification']
      });
  }
}
