import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatThreadClient } from '@azure/communication-chat';
import { UserChannelService } from '../../services/user-channel.service';
import { GetUserByUsernameService } from '../../services/get-user-by-username.service';
import { User } from '../../types/user';

@Component({
  selector: 'app-remove-user-from-channel-dialog',
  templateUrl: './remove-user-from-channel-dialog.component.html',
  styleUrls: ['./remove-user-from-channel-dialog.component.scss'],
})
export class RemoveUserFromChannelDialogComponent implements OnInit {
  findUserByUsernameForm = new FormGroup({
    username: new FormControl(''),
    channelId: new FormControl(this.data.channelId),
  });

  constructor(
    private dialogRef: MatDialogRef<RemoveUserFromChannelDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      channelId: number;
      chatThreadClient: ChatThreadClient;
    },
    private getUserByUsernameService: GetUserByUsernameService,
    private userChannelService: UserChannelService
  ) {}

  ngOnInit(): void {}

  /** remove user from chat thread */
  private async removeUserFromThread(communicationUserId: string) {
    await this.data.chatThreadClient.removeParticipant({
      communicationUserId: communicationUserId,
    });
  }

  /** get user data */
  private async getUserData() {
    let user: User = new User();
    await this.getUserByUsernameService
      .getUserData(this.findUserByUsernameForm)
      .toPromise()
      .then((data) => {
        user = data;
      });
    return user;
  }

  /** remove user from the chat thread and channel */
  async removeUser() {
    let user = await this.getUserData();
    if (user) {
      let removeUserForm = new FormGroup({
        channelId: new FormControl(this.data.channelId),
        userID: new FormControl(user.accountId),
      });

      this.userChannelService.removeUser(removeUserForm).subscribe(async () => {
        await this.removeUserFromThread(user.communicationUserId);

        this.userChannelService.sendUserUpdate('userRemoved');
      });

      this.close();
    } else {
      alert('USER DOES NOT EXIST');
    }
  }
  /** close dialog */
  close() {
    this.dialogRef.close();
  }
}
