import { TestBed } from '@angular/core/testing';

import { CompanyPackageResolverService } from './company-package-resolver.service';

describe('CompanyPackageResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyPackageResolverService = TestBed.get(CompanyPackageResolverService);
    expect(service).toBeTruthy();
  });
});
