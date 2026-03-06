import { TestBed } from '@angular/core/testing';

import { SubmitForm } from './submit-form';

describe('SubmitForm', () => {
  let service: SubmitForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmitForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
