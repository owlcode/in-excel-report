import { TestBed } from '@angular/core/testing';

import { InExcelExportService } from './in-excel-export.service';

describe('InExcelExportService', () => {
  let service: InExcelExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InExcelExportService],
    });
    service = TestBed.inject(InExcelExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not fail when passed empty array', () => {
    expect(service.createMultiReport([])).toEqual([
      [
        'LOG_DATE_FROM',
        'LOG_DATE_TO',
        'LOG_CLIENT',
        'LOG_ISSUE_NAME',
        'LOG_PROJECT_HOURS',
        'LOG_INTERNAL_HOURS',
      ],
    ]);
  });

  it('should convert single card to report', () => {
    expect(
      service.createMultiReport([
        {
          client: 'c',
          project: 'p',
          hours: 8,
          isInternal: false,
          selectedDays: new Set([
            '2021-12-01',
            '2021-12-02',
            '2021-12-03',
            '2021-12-06',
            '2021-12-07',
            '2021-12-08',
            '2021-12-09',
            '2021-12-10',
            '2021-12-13',
            '2021-12-14',
            '2021-12-15',
            '2021-12-16',
            '2021-12-17',
            '2021-12-20',
            '2021-12-21',
            '2021-12-22',
            '2021-12-23',
            '2021-12-24',
            '2021-12-27',
            '2021-12-28',
            '2021-12-29',
            '2021-12-30',
            '2021-12-31',
          ]),
        },
      ])
    ).toEqual([
      [
        'LOG_DATE_FROM',
        'LOG_DATE_TO',
        'LOG_CLIENT',
        'LOG_ISSUE_NAME',
        'LOG_PROJECT_HOURS',
        'LOG_INTERNAL_HOURS',
      ],
      ['2021-12-01', '2021-12-05', 'c', 'p', '24', '0'],
      ['2021-12-06', '2021-12-12', 'c', 'p', '40', '0'],
      ['2021-12-13', '2021-12-19', 'c', 'p', '40', '0'],
      ['2021-12-20', '2021-12-26', 'c', 'p', '40', '0'],
      ['2021-12-27', '2021-12-31', 'c', 'p', '40', '0'],
      [],
      [],
      ['', '', '', '', '184', '0'],
    ]);
  });

  it('should convert multiple cards to report', () => {
    expect(
      service.createMultiReport([
        {
          client: 'c',
          project: 'p',
          hours: 1,
          isInternal: true,
          selectedDays: new Set(['2021-12-01', '2021-12-02', '2021-12-03']),
        },
        {
          client: 'c',
          project: 'p',
          hours: '1',
          isInternal: false,
          selectedDays: new Set([
            '2021-12-06',
            '2021-12-07',
            '2021-12-08',
            '2021-12-09',
            '2021-12-10',
            '2021-12-01',
            '2021-12-03',
            '2021-12-02',
          ]),
        },
        {
          client: 'c2',
          project: 'p2',
          hours: '1',
          isInternal: true,
          selectedDays: new Set([
            '2021-12-13',
          ]),
        },
        {
          client: 'c2',
          project: 'p2',
          hours: '8',
          isInternal: false,
          selectedDays: new Set([
            '2021-12-13',
            '2021-12-14',
            '2021-12-15',
            '2021-12-16',
            '2021-12-17',
            '2021-12-20',
            '2021-12-21',
            '2021-12-22',
            '2021-12-23',
            '2021-12-24',
            '2021-12-27',
            '2021-12-28',
            '2021-12-29',
            '2021-12-30',
            '2021-12-31',
          ]),
        },
      ])
    ).toEqual([
      [
        'LOG_DATE_FROM',
        'LOG_DATE_TO',
        'LOG_CLIENT',
        'LOG_ISSUE_NAME',
        'LOG_PROJECT_HOURS',
        'LOG_INTERNAL_HOURS',
      ],
      ['2021-12-01', '2021-12-05', 'c', 'p', '3', '3'],
      ['2021-12-06', '2021-12-12', 'c', 'p', '5', '0'],
      ['2021-12-13', '2021-12-19', 'c2', 'p2', '40', '1'],
      ['2021-12-20', '2021-12-26', 'c2', 'p2', '40', '0'],
      ['2021-12-27', '2021-12-31', 'c2', 'p2', '40', '0'],
      [],
      [],
      ['', '', '', '', '128', '4'],
    ]);
  });
});
