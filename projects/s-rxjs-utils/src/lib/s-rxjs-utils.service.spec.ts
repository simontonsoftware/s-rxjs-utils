import { inject, TestBed } from '@angular/core/testing';

import { SRxjsUtilsService } from './s-rxjs-utils.service';

describe('SRxjsUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SRxjsUtilsService]
    });
  });

  it('should be created', inject(
    [SRxjsUtilsService],
    (service: SRxjsUtilsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
