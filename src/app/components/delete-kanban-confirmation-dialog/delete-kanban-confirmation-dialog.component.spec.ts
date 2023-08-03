import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteKanbanConfirmationDialogComponent } from './delete-kanban-confirmation-dialog.component';

describe('DeleteKanbanConfirmationDialogComponent', () => {
  let component: DeleteKanbanConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteKanbanConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteKanbanConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteKanbanConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
