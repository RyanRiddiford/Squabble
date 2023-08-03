import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKanbanItemDialogComponent } from './add-kanban-item-dialog.component';

describe('AddKanbanItemDialogComponent', () => {
  let component: AddKanbanItemDialogComponent;
  let fixture: ComponentFixture<AddKanbanItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddKanbanItemDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKanbanItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
