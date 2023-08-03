import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import { MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { KanbanComponent } from './kanban.component';
import { KanbanRoutingModule } from './kanban-routing.module';
import { AddKanbanItemDialogComponent } from '../../components/add-kanban-item-dialog/add-kanban-item-dialog.component';
import { DeleteKanbanConfirmationDialogComponent } from '../../components/delete-kanban-confirmation-dialog/delete-kanban-confirmation-dialog.component';
import { EditKanbanItemDialogComponent } from '../../components/edit-kanban-item-dialog/edit-kanban-item-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    KanbanRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [
    AddKanbanItemDialogComponent,
    DeleteKanbanConfirmationDialogComponent,
    EditKanbanItemDialogComponent,
    KanbanComponent
  ],
})
export class KanbanModule {
}
