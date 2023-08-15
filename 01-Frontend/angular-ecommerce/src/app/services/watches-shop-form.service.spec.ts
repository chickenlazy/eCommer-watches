import { TestBed } from '@angular/core/testing';

import { WatchesShopFormService } from './watches-shop-form.service';

describe('WatchesShopFormService', () => {
  let service: WatchesShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchesShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
