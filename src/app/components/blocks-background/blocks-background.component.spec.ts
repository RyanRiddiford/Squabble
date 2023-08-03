import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocksBackgroundComponent } from './blocks-background.component';

describe('BlocksBackgroundComponent', () => {
  let component: BlocksBackgroundComponent;
  let fixture: ComponentFixture<BlocksBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlocksBackgroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocksBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
