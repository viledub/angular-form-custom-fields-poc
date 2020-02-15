import { TestBed } from '@angular/core/testing';

import { ValidationManagerService } from './validation-manager.service';

fdescribe('ValidationManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidationManagerService = TestBed.get(ValidationManagerService);
    expect(service).toBeTruthy();
  });
});
