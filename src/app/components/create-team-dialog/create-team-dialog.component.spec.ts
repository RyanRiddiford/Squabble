import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeamDialogComponent } from './create-team-dialog.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";

describe('CreateTeamDialogComponent', () => {
  let component: CreateTeamDialogComponent;
  let fixture: ComponentFixture<CreateTeamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTeamDialogComponent ],
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
    fixture = TestBed.createComponent(CreateTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
