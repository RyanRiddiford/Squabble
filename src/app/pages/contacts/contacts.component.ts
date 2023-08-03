import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendDialogComponent } from '../../components/add-friend-dialog/add-friend-dialog.component';
import { SquabbleFriendshipService } from '../../services/squabble-friendship.service';
import {SquabbleAccountService} from "../../services/squabble-account.service";
import { ChatClientService } from '../../services/acs-services/chat-client.service';
import {User} from "../../types/user";
import {GetAccountDataService} from "../../services/get-account-data.service";
import {ChannelService} from "../../services/squabble-channel.service";
import {FormControl, FormGroup} from "@angular/forms";
import {UserChannelService} from "../../services/user-channel.service";
import {Channel} from "../../types/channel";
import { CallClientService } from '../../services/acs-services/call-client.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  private loggedInUsername: string = "";
  friends: any[] = [];
  pendingFriendsForMeToAccept: any[] = []
  pendingFriendsForThemToAccept: any[] = []
  userData: User = new User();
  selectedChannel: Channel | null = null;

  constructor(
    private dialog: MatDialog,
    private squabbleAccountService: SquabbleAccountService,
    private squabbleFriendshipService: SquabbleFriendshipService,
    private chatClientService: ChatClientService,
    private getAccountDataService: GetAccountDataService,
    private squabbleChannelService: ChannelService,
    private addUserToChannelService: UserChannelService,
    private callClientService: CallClientService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getAccountDataService.getCurrentUserData().then((data) => {
      this.userData = data;
    });

    this.squabbleAccountService.accountData.subscribe((data) => {
      this.loggedInUsername = data.userName;
    });

    this.squabbleFriendshipService.friendList.subscribe((data) => {
      this.friends = data;
    });

    this.squabbleFriendshipService.pendingFriendList.subscribe((data) => {
      // Clear the arrays so we can reload them.
      this.pendingFriendsForMeToAccept = [];
      this.pendingFriendsForThemToAccept = [];

      for (const pendingFriendRequest of data) {
        if (pendingFriendRequest.senderUsername == this.loggedInUsername) {
          this.pendingFriendsForThemToAccept.push(pendingFriendRequest);
        } else {
          this.pendingFriendsForMeToAccept.push(pendingFriendRequest);
        }
      }
    });

    this.squabbleFriendshipService.reloadFriendList();
  }

  addFriend(){
    this.dialog.open(
      AddFriendDialogComponent,
      {panelClass: 'custom-dialog-container'}
    );
  }

  getInitials(firstName: string, surname:string ){
    return firstName.charAt(0) + surname.charAt(0)
  }

  displayFriendInfo(friend: any){
    alert(`acs: ${friend.acsId}`)
  }

  acceptFriendRequest(friendRequest: any, accepted: boolean) {
    this.squabbleFriendshipService.acceptFriendRequest(friendRequest.friendRequestId, accepted).subscribe(async () => {
      await this.createChannel(friendRequest);
      this.squabbleFriendshipService.reloadFriendList();
    });
  }

  loadChat(friend: any) {
    this.squabbleChannelService.getOneToOneConversation(friend.accountId).subscribe((data) => {
      this.selectedChannel = data;
      this.callClientService.isFriendCall = true;
      this.callClientService.friendAcsId = friend.acsId;
    });
  }

  private async createChannel(friendRequest: any) {
    const channelName = `${friendRequest.senderAccountId}-${friendRequest.receiverAccountId}`;

    let createChatThreadRequest = {
      topic: channelName,
    };

    let createChatThreadOptions = {
      participants: [
        {
          displayName: friendRequest.senderUsername,
          id: { communicationUserId: friendRequest.senderCommunicationUserId }
        },
        {
          displayName: friendRequest.receiverUsername,
          id: { communicationUserId: friendRequest.receiverCommunicationUserId }
        }
      ]
    };

    let createChatThreadResult = await this.chatClientService.chatClient.createChatThread(
      createChatThreadRequest,
      createChatThreadOptions
    );

    this.squabbleChannelService.createChannel(null, channelName, createChatThreadResult.chatThread!.id)
      .subscribe((channelId) => {
        let addUserForm = new FormGroup({
          channelId: new FormControl(channelId),
          userID: new FormControl(friendRequest.senderAccountId)
        });

        this.addUserToChannelService.addUser(addUserForm).subscribe();
      });
  }
}
