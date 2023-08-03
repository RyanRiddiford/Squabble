import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateTeamDialogComponent } from '../../components/create-team-dialog/create-team-dialog.component';
import { SquabbleTeamService } from "../../services/squabble-team.service";
import { GetAccountDataService } from '../../services/get-account-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  listOfServerIDs: number[];

  constructor(
    private getAccountDataService: GetAccountDataService,
    private dialog: MatDialog,
    private squabbleTeamService: SquabbleTeamService
  ) { }

  ngOnInit(): void {
    this.squabbleTeamService.reloadTeamList.subscribe(() => {
      this.listOfServerIDs = this.displayServers();
    });
  }

  // Creates new team
  createTeam() {
    this.dialog.open(
      CreateTeamDialogComponent,
      { panelClass:'custom-dialog-container'}
    );
  }

  // Displays all teams user is an member of
  displayServers() {
    let servers: number[] = []

    this.squabbleTeamService.getIDsOfAllJoinedTeams().subscribe(data => {
      data.forEach((x: any) => {
        servers.push(x.serverID)
      })
    })

    return servers
  }
}
