import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUserFromChannelDialogComponent } from './remove-user-from-channel-dialog.component';

describe('RemoveUserFromChannelDialogComponent', () => {
  let component: RemoveUserFromChannelDialogComponent;
  let fixture: ComponentFixture<RemoveUserFromChannelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveUserFromChannelDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveUserFromChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
