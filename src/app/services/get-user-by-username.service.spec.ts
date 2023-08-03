import { TestBed } from '@angular/core/testing';

import { GetUserByUsernameService } from './get-user-by-username.service';
import { HttpClientModule } from '@angular/common/http';

describe('GetUserByUsernameService', () => {
  let service: GetUserByUsernameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(GetUserByUsernameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
