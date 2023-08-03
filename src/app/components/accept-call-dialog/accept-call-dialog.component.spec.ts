import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptCallDialogComponent } from './accept-call-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";

describe('AcceptCallDialogComponent', () => {
  let component: AcceptCallDialogComponent;
  let fixture: ComponentFixture<AcceptCallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptCallDialogComponent ],
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
    fixture = TestBed.createComponent(AcceptCallDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
