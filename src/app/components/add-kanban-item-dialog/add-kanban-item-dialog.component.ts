import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SquabbleKanbanService } from '../../services/squabble-kanban.service';

@Component({
  selector: 'app-add-kanban-item-dialog',
  templateUrl: './add-kanban-item-dialog.component.html',
  styleUrls: ['./add-kanban-item-dialog.component.scss']
})
export class AddKanbanItemDialogComponent implements OnInit {

  addItemForm = new FormGroup({
    itemName: new FormControl(''),
  })

  constructor(
    private dialogRef: MatDialogRef<AddKanbanItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { list: { itemName: string, listName: string, position: number }[], listName: string },
    private squabbleKanbanService: SquabbleKanbanService
  ) { }

  ngOnInit(): void {
  }

  add() {
    if (this.addItemForm.value.itemName.length < 1 || this.addItemForm.value.itemName.length > 20) {
      document.querySelector('#error')!.innerHTML = "Must be 1-20 characters"
    } else {
      let newItem = {
        itemName: this.addItemForm.value.itemName,
        listName: this.data.listName,
        position: (this.data.list.length)
      }

      this.data.list.push(newItem)
      this.squabbleKanbanService.addItem(newItem).subscribe(() => {
        this.dialogRef.close();
      })
    }
  }

  close() {
    this.dialogRef.close()
  }
}
