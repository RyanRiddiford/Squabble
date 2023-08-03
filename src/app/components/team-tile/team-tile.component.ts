import { Component, OnInit, Input } from '@angular/core';
import {SquabbleTeamService} from "../../services/squabble-team.service";

@Component({
  selector: 'app-team-tile',
  templateUrl: './team-tile.component.html',
  styleUrls: ['./team-tile.component.scss']
})
export class TeamTileComponent implements OnInit {
  teamName!: string

  @Input() serverID!: string;

  constructor(
    private squabbleTeamService: SquabbleTeamService
  ) {  }

  ngOnInit(): void {
    this.squabbleTeamService.getServerById(parseInt(this.serverID)).subscribe(data =>{
      this.teamName = data.serverName
    })
  }
}
