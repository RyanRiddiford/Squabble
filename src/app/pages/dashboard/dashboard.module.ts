import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CreateTeamDialogComponent } from '../../components/create-team-dialog/create-team-dialog.component';
import { TeamTileComponent } from '../../components/team-tile/team-tile.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [
    CreateTeamDialogComponent,
    DashboardComponent,
    TeamTileComponent
  ],
})
export class DashboardModule {
}
