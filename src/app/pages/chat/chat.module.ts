import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InlineSVGModule } from 'ng-inline-svg';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { ServerComponent } from './server/server.component';
import { AddUserToChannelDialogComponent } from '../../components/add-user-to-channel-dialog/add-user-to-channel-dialog.component';
import { AddUserToTeamDialogComponent } from '../../components/add-user-to-team-dialog/add-user-to-team-dialog.component';
import { CreateGroupDialogComponent } from '../../components/create-group-dialog/create-group-dialog.component';
import { ManageServerUsersDialogComponent } from '../../components/manage-server-users-dialog/manage-server-users-dialog.component';
import { ChatInnerModule } from '../../components/partials';
import { ChannelsComponent } from '../../components/partials/channels/channels.component';
import { RemoveUserFromChannelDialogComponent } from '../../components/remove-user-from-channel-dialog/remove-user-from-channel-dialog.component';

@NgModule({
  declarations: [
    AddUserToChannelDialogComponent,
    AddUserToTeamDialogComponent,
    ChannelsComponent,
    ChatComponent,
    CreateGroupDialogComponent,
    ManageServerUsersDialogComponent,
    ServerComponent,
    RemoveUserFromChannelDialogComponent
  ],
  imports: [
    CdkAccordionModule,
    ChatInnerModule,
    ChatRoutingModule,
    CommonModule,
    FontAwesomeModule,
    InlineSVGModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TooltipModule
  ],
})
export class ChatModule {}
