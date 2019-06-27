import { TestBed } from '@angular/core/testing';

import { WorkFunctionPackageResolverService } from './work-function-package-resolver.service';

describe('WorkFunctionPackageResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkFunctionPackageResolverService = TestBed.get(WorkFunctionPackageResolverService);
    expect(service).toBeTruthy();
  });
});
