import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-participant-dialog',
  templateUrl: './add-participant-dialog.component.html',
  styleUrls: ['./add-participant-dialog.component.scss'],
})
export class AddParticipantDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddParticipantDialogComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      acsId: [''],
    });
  }

  add() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
