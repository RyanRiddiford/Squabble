import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendDialogComponent } from './add-friend-dialog.component';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { HttpClientModule } from "@angular/common/http";

describe('AddFriendDialogComponent', () => {
  let component: AddFriendDialogComponent;
  let fixture: ComponentFixture<AddFriendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFriendDialogComponent ],
      imports: [
        HttpClientModule,
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFriendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
