import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKanbanItemDialogComponent } from './edit-kanban-item-dialog.component';

describe('EditKanbanItemDialogComponent', () => {
  let component: EditKanbanItemDialogComponent;
  let fixture: ComponentFixture<EditKanbanItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditKanbanItemDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKanbanItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
