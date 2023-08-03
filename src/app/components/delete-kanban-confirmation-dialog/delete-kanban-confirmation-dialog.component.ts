import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SquabbleKanbanService } from 'src/app/services/squabble-kanban.service';

@Component({
  selector: 'app-delete-kanban-confirmation-dialog',
  templateUrl: './delete-kanban-confirmation-dialog.component.html',
  styleUrls: ['./delete-kanban-confirmation-dialog.component.scss']
})
export class DeleteKanbanConfirmationDialogComponent implements OnInit {

  deleteItemForm = new FormGroup({
  })

  constructor(
    private dialogRef: MatDialogRef<DeleteKanbanConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {item: {kanbanItemID:number, itemName:string, listName:string, position:number}
    list: {kanbanItemID:number, itemName:string, listName:string, position:number}[]},
    private kanbanService: SquabbleKanbanService
  ) { }

  ngOnInit(): void {
  }

  delete(){
    let index = this.data.list.indexOf(this.data.item)
    this.data.list.splice(index, 1)
    this.kanbanService.deleteItem(this.data.item.kanbanItemID).subscribe()
    this.dialogRef.close()
  }

  cancel(){
    this.dialogRef.close()
  }

}
