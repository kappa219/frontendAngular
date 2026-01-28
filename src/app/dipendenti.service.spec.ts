import { TestBed } from '@angular/core/testing';

import { DipendentiService } from './dipendenti.service';

describe('DipendentiService', () => {
  let service: DipendentiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DipendentiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
