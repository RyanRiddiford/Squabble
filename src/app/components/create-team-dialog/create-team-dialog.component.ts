import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SquabbleTeamService } from '../../services/squabble-team.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-team-dialog',
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.scss']
})
export class CreateTeamDialogComponent implements OnInit {
  userId = localStorage.getItem('accountId');

  private readonly blankTeamNameMessage: string = "You must provide a name in order to create a Team";

  createTeamForm = new FormGroup({
    Name: new FormControl('', Validators.compose([Validators.minLength(1)]))
  })

  constructor(
    private dialogRef: MatDialogRef<CreateTeamDialogComponent>,
    private squabbleTeamService: SquabbleTeamService,
    private notification: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.createTeamForm.controls['Name'].addValidators(Validators.requiredTrue);
  }

  create() {



    //If no team name provided, show error message and prevent request for team creation
    if (this.createTeamForm.controls['Name'].value == '') {


      this.notification.open(this.blankTeamNameMessage, '',
        {
          duration: 4000,
          verticalPosition: 'top',
          panelClass: ['error-notification']
        });



      return;
    }
    //If valid team name provided, allow request for creating team
    else {
      //Close error message for invalid team name
      this.notification.dismiss();

      //Close create team dialog box, request team creation, then reload dashboard
    this.dialogRef.close(this.squabbleTeamService.createTeam(this.createTeamForm).subscribe(() => {
      this.squabbleTeamService.triggerReloadTeamList();
    }))

    }


  }

  //Close the team dialog box
  close() {
    this.dialogRef.close()
  }
}
