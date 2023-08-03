import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserToTeamDialogComponent } from './add-user-to-team-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";

describe('AddUserToTeamDialogComponent', () => {
  let component: AddUserToTeamDialogComponent;
  let fixture: ComponentFixture<AddUserToTeamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserToTeamDialogComponent ],
      imports: [
        HttpClientModule,
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserToTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
