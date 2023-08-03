import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChatThreadClient } from '@azure/communication-chat';
import { AddUserToChannelDialogComponent } from '../../../components/add-user-to-channel-dialog/add-user-to-channel-dialog.component';
import { Channel } from '../../../types/channel';
import { User } from '../../../types/user';
import { GetAccountDataService } from '../../../services/get-account-data.service';
import { ChatClientService } from '../../../services/acs-services/chat-client.service';
import { SquabbleTeamService } from '../../../services/squabble-team.service';
import { ManageServerUsersDialogComponent } from '../../../components/manage-server-users-dialog/manage-server-users-dialog.component';
import { UserChannelService } from 'src/app/services/user-channel.service';
import { Subscription } from 'rxjs';
import { RemoveUserFromChannelDialogComponent } from 'src/app/components/remove-user-from-channel-dialog/remove-user-from-channel-dialog.component';
import { AddUserToTeamDialogComponent } from '../../../components/add-user-to-team-dialog/add-user-to-team-dialog.component';

@Component({
  selector: 'app-chat-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss'],
})
export class ServerComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'd-flex flex-column flex-lg-row';

  serverId: number | null = null;
  channel: Channel | null = null;
  // userData: User = new User();
  chatThreadClient: ChatThreadClient | null = null;
  chatParticipants: User[] = [];

  private userAddedSubscription: Subscription;

  server: any;
  owner: any;
  admins: any;
  members: any;

  constructor(
    private accountDataService: GetAccountDataService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private chatClientService: ChatClientService,
    private squabbleTeamService: SquabbleTeamService,
    private addUserToChannelService: UserChannelService
  ) {
    this.userAddedSubscription = this.addUserToChannelService
      .getUserUpdate()
      .subscribe(async () => {
        await this.listParticipants();
      });
  }

  ngOnDestroy(): void {
    this.userAddedSubscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params: Params) => {
      this.serverId = params.serverId;

      // TODO: I was having backend EF/SQL issues trying to make this a single call. Got
      //       frustrated, so multiple calls it is.
      this.server = await this.squabbleTeamService
        .getServerById(this.serverId as number)
        .toPromise();
      this.owner = await this.squabbleTeamService
        .getServerOwner(this.serverId as number)
        .toPromise();
      this.admins = await this.squabbleTeamService
        .getServerAdmins(this.serverId as number)
        .toPromise();
      this.members = await this.squabbleTeamService
        .getServerMembers(this.serverId as number)
        .toPromise();
    });
  }

  /** setup required services for group chat */
  async setupChatServices() {
    // get a chat thread client
    this.chatThreadClient =
      this.chatClientService.chatClient.getChatThreadClient(
        this.channel?.azureChatThreadId ?? ''
      );
    await this.listParticipants();
  }

  addUserToChannel() {
    this.dialog.open(AddUserToChannelDialogComponent, {
      data: {
        channelId: this.channel?.channelId,
        chatThreadClient: this.chatThreadClient,
      },
      panelClass: 'custom-dialog-container',
    });
  }

  manageUsers() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    this.dialog.open(ManageServerUsersDialogComponent, {
      autoFocus: true,
      data: {
        serverId: this.serverId,
        owner: this.owner,
        admins: this.admins,
        members: this.members,
      }
    }).afterClosed().subscribe(async () => {
      await this.updateUserList();
    });
  }

  removeUserFromChannel() {
    this.dialog.open(RemoveUserFromChannelDialogComponent, {
      data: {
        channelId: this.channel?.channelId,
        chatThreadClient: this.chatThreadClient,
      },
      panelClass: 'custom-dialog-container',
    });
  }

  /** list chat thread participants */
  async listParticipants() {
    const participants = this.chatThreadClient!.listParticipants();
    let users: Array<User> = [];
    for await (const participant of participants) {
      const p = participant as any;
      let user = await this.accountDataService.getUserByCommunicationUserId(
        p.id.communicationUserId
      );
      users.push(user);
    }
    this.chatParticipants = users;
  }

  addUserToTeam() {
    this.dialog.open(
      AddUserToTeamDialogComponent,
      { data: { serverID: this.serverId }, panelClass: 'custom-dialog-container' }
    ).afterClosed().subscribe(async () => {
      await this.updateUserList();
    });
  }

  async updateUserList() {
    this.owner = await this.squabbleTeamService.getServerOwner(this.serverId).toPromise();
    this.admins = await this.squabbleTeamService.getServerAdmins(this.serverId).toPromise();
    this.members = await this.squabbleTeamService.getServerMembers(this.serverId).toPromise();
  }
}
