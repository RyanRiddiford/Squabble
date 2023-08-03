import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SquabbleKanbanService } from 'src/app/services/squabble-kanban.service';

@Component({
  selector: 'app-edit-kanban-item-dialog',
  templateUrl: './edit-kanban-item-dialog.component.html',
  styleUrls: ['./edit-kanban-item-dialog.component.scss']
})
export class EditKanbanItemDialogComponent implements OnInit {

  editItemForm = new FormGroup({
    itemName: new FormControl(this.data.item.itemName),
  })

  constructor(
    private dialogRef: MatDialogRef<EditKanbanItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {item: {kanbanItemID:number, itemName:string, listName:string, position:number}
    list: {kanbanItemID:number, itemName:string, listName:string, position:number}[]},
    private squabbleKanbanService: SquabbleKanbanService
  ) { }

  ngOnInit(): void {
  }

  edit(){
    if(this.editItemForm.value.itemName.length < 1 || this.editItemForm.value.itemName.length > 20){
      document.querySelector('#error')!.innerHTML = "Must be 1-20 characters"
    }else{
      let newItem = {
        kanbanItemID: this.data.item.kanbanItemID,
        itemName: this.editItemForm.value.itemName,
        listName: this.data.item.listName,
        position: (this.data.item.position)
      }
  
      let arrayIndex = this.data.list.findIndex(obj => obj.kanbanItemID == this.data.item.kanbanItemID)
      this.data.list[arrayIndex].itemName = newItem.itemName
      this.squabbleKanbanService.updateItem(newItem).subscribe()
      this.dialogRef.close()
    }
  }

  close() {
    this.dialogRef.close()
  }

}
