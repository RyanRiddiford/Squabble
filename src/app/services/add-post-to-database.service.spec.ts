import { TestBed } from '@angular/core/testing';

import { AddPostToDatabaseService } from './add-post-to-database.service';

describe('AddPostToDatabaseService', () => {
  let service: AddPostToDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPostToDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
