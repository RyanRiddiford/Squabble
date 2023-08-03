import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { SquabbleAccountService } from 'src/app/services/squabble-account.service';
import { SquabbleTeamService } from '../../services/squabble-team.service';

@Component({
  selector: 'app-manage-server-users-dialog',
  templateUrl: './manage-server-users-dialog.component.html',
  styleUrls: ['./manage-server-users-dialog.component.scss']
})
export class ManageServerUsersDialogComponent implements OnInit {
  faQuestionCircle = faQuestionCircle;
  userId: number | null = null;
  isOwner: boolean = false;
  isAdmin: boolean = false;
  isProcessingRequest: boolean = false;
  defaultAvatarUrl: string = '/assets/images/default-avatar.jpeg';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      serverId: number,
      owner: any,
      admins: any,
      members: any
    },
    private dialogRef: MatDialogRef<ManageServerUsersDialogComponent>,
    private squabbleAccountService: SquabbleAccountService,
    private squabbleTeamService: SquabbleTeamService
  ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('accountId') as string);
    this.squabbleAccountService.refreshAccountData();
    if (this.userId === this.data.owner.user.accountId) {
     this.isOwner = true;
    } else {
      for (const admin of this.data.admins) {
        if (this.userId === admin.user.accountId) {
          this.isAdmin = true;
          break;
        }
      }
    }
  }

  close() {
    this.dialogRef.close()
  }

  makeAdminAnOwner(accountId: number) {
    this.isProcessingRequest = true;
    this.squabbleTeamService.replaceOwner(this.data.serverId, accountId).subscribe(async () => {
      await this.updateUserList();
      this.isProcessingRequest = false;
    });
  }

  makeUserAdmin(accountId: number) {
    this.isProcessingRequest = true;
    this.squabbleTeamService.makeAdmin(this.data.serverId, accountId).subscribe(async () => {
      await this.updateUserList();
      this.isProcessingRequest = false;
    });
  }

  makeUserMember(accountId: number) {
    this.isProcessingRequest = true;
    this.squabbleTeamService.makeMember(this.data.serverId, accountId).subscribe(async () => {
      await this.updateUserList();
      this.isProcessingRequest = false;
    });
  }

  removeUser(accountId: number) {
    this.isProcessingRequest = true;
    this.squabbleTeamService.removeUser(this.data.serverId, accountId).subscribe(async () => {
      await this.updateUserList();
      this.isProcessingRequest = false;
    });
  }

  async updateUserList() {
    this.data.owner = await this.squabbleTeamService.getServerOwner(this.data.serverId as number).toPromise();
    this.data.admins = await this.squabbleTeamService.getServerAdmins(this.data.serverId as number).toPromise();
    this.data.members = await this.squabbleTeamService.getServerMembers(this.data.serverId as number).toPromise();
  }

  getAvatarUrl(user: any) {
    return user.avatar === null ? this.defaultAvatarUrl : user.avatar;
  }
}
