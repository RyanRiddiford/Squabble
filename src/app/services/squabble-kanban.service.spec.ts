import { TestBed } from '@angular/core/testing';

import { SquabbleKanbanService } from './squabble-kanban.service';

describe('SquabbleKanbanService', () => {
  let service: SquabbleKanbanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SquabbleKanbanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
