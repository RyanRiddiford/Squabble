import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GetUserByUsernameService } from 'src/app/services/get-user-by-username.service';
import { SquabbleFriendshipService } from 'src/app/services/squabble-friendship.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-add-friend-dialog',
  templateUrl: './add-friend-dialog.component.html',
  styleUrls: ['./add-friend-dialog.component.scss']
})
export class AddFriendDialogComponent implements OnInit {

  findUserByUserNameForm = new FormGroup({
    username: new FormControl('')
  })

  constructor(
    private dialogRef: MatDialogRef<AddFriendDialogComponent>,
    private getUserByUsernameService: GetUserByUsernameService,
    private squabbleFriendshipService: SquabbleFriendshipService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close()
  }

  addFriend() {
    this.getUserByUsernameService.getUserData(this.findUserByUserNameForm).subscribe((user) => {
      if (user) {
        this.squabbleFriendshipService.sendFriendRequest(user.accountId).subscribe(() => {
          this.squabbleFriendshipService.reloadFriendList();
          this.dialogRef.close();
        });
      } else {
        alert("USER DOES NOT EXIST")
      }
    })
  }

}
