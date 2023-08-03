import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTileComponent } from './team-tile.component';
import {HttpClientModule} from "@angular/common/http";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatMenu, MatMenuModule} from "@angular/material/menu";

describe('TeamTileComponent', () => {
  let component: TeamTileComponent;
  let fixture: ComponentFixture<TeamTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamTileComponent ],
      imports: [
        HttpClientModule,
        MatDialogModule,
        MatMenuModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
