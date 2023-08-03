import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss'],
})
export class CreateGroupDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    private notification: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      groupName: [''],
    });
  }

  create() {
    if (this.form.value.groupName === ''){
      this.openNotification("Field cannot be blank")
    }else{
      this.dialogRef.close(this.form.value);
    }

  }

  close() {
    this.dialogRef.close();
  }

  openNotification(message: string) {
    this.notification.open(message, '', 
      {
        duration: 4000,
        verticalPosition: 'top',
        panelClass: ['error-notification']
      });
  }
}
