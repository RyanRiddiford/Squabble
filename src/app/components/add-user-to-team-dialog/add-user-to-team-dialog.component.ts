import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GetUserByUsernameService } from 'src/app/services/get-user-by-username.service';
import {SquabbleTeamService} from "../../services/squabble-team.service";
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-user-to-team-dialog',
  templateUrl: './add-user-to-team-dialog.component.html',
  styleUrls: ['./add-user-to-team-dialog.component.scss']
})
export class AddUserToTeamDialogComponent implements OnInit {

  findUserByUserNameForm = new FormGroup({
    username: new FormControl(''),
    serverID: new FormControl(this.data.serverID)
  })

  constructor(
    private dialogRef: MatDialogRef<AddUserToTeamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {serverID: number},
    private squabbleTeamService: SquabbleTeamService,
    private getUserByUsernameService: GetUserByUsernameService,
    private notification: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  addUser(){
    // If field is blank, and user clicks 'add' display notification
    if(this.findUserByUserNameForm.value.username == ''){
      this.openNotification("Field cannot be blank", 'error-notification')
    }

    this.getUserByUsernameService.getUserData(this.findUserByUserNameForm).subscribe((user) => {

      if(user){
        let addUserForm = new FormGroup({
          userID: new FormControl(user.accountId),
          serverID: new FormControl(this.data.serverID)
        })

      this.squabbleTeamService.addUserToTeam(addUserForm).subscribe()
      //ADDS BY USER ID
      this.openNotification("User added to team", 'confirm-notification')
      this.dialogRef.close()
      }else{
        // Notification displayed where user is not found
        this.openNotification("User cannot be found. Check the username and try again.", 'error-notification')
      }

    })
  }

  // Close button
  close() {
    this.dialogRef.close()
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

}
