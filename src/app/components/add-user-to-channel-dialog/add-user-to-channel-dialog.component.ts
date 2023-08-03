import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChatThreadClient } from '@azure/communication-chat';
import { GetUserByUsernameService } from '../../services/get-user-by-username.service';
import { UserChannelService } from '../../services/user-channel.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user-to-channel-dialog',
  templateUrl: './add-user-to-channel-dialog.component.html',
  styleUrls: ['./add-user-to-channel-dialog.component.scss'],
})
export class AddUserToChannelDialogComponent implements OnInit {
  findUserByUsernameForm = new FormGroup({
    username: new FormControl(''),
    channelId: new FormControl(this.data.channelId),
  });


  constructor(
    private dialogRef: MatDialogRef<AddUserToChannelDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      channelId: number;
      chatThreadClient: ChatThreadClient;
    },
    private userChannelService: UserChannelService,
    private getUserByUsernameService: GetUserByUsernameService,
    private notification: MatSnackBar
  ) {}

  ngOnInit(): void {}

  addUser() {

    this.notification.dismiss();

    this.getUserByUsernameService
      .getUserData(this.findUserByUsernameForm)
      .subscribe(async (user) => {
        if (user) {
          let addUserForm = new FormGroup({
            channelId: new FormControl(this.data.channelId),
            userID: new FormControl(user.accountId),
          });

          const addParticipantsRequest = {
            participants: [
              {
                id: { communicationUserId: user.communicationUserId },
                displayName: user.username,
              },
            ],
          };

          this.userChannelService.addUser(addUserForm).subscribe(async () => {
              await this.data.chatThreadClient.addParticipants(
                addParticipantsRequest
              );

              this.userChannelService.sendUserUpdate('userAdded');
              this.openNotification("Added user to channel", "confirm-notification");
              this.dialogRef.close();
            },
            () => {
              this.openNotification(
                "Unable to add user to channel, this can happen if a user isn't part of the server.",
                "error-notification"
              );
            });
        } else {
          this.openNotification("User does not exist", "error-notification");
        }
      });
  }


  // Notification
  openNotification(message: string, type: string) {
    this.notification.open(message, '',
      {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: [type]
      });
  }


  close() {
    this.dialogRef.close();
  }
}
