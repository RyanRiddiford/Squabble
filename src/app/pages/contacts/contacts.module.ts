import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ContactsComponent } from './contacts.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { AddFriendDialogComponent } from '../../components/add-friend-dialog/add-friend-dialog.component';
import { ChatInnerModule } from '../../components/partials';

@NgModule({
  imports: [
    ChatInnerModule,
    CommonModule,
    ContactsRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [AddFriendDialogComponent, ContactsComponent],
})
export class ContactsModule {
}
