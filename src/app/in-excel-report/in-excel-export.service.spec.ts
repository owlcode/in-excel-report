import { TestBed } from '@angular/core/testing';

import { InExcelExportService } from './in-excel-export.service';

describe('InExcelExportService', () => {
  let service: InExcelExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InExcelExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
