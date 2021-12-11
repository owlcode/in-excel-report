import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  eachWeekOfInterval,
  endOfWeek,
  format,
  isSameMonth,
  isWithinInterval,
  lastDayOfMonth,
  parseISO,
  startOfMonth,
  toDate,
} from 'date-fns';
import ls from 'localstorage-slim';
import { Subscription, tap } from 'rxjs';
import * as xlsx from 'xlsx';
import {
  IReportEntry,
  ReportConfig,
  WorkingDay,
} from './in-excel-export.model';
@Injectable()
export class InExcelExportService {
  readonly dateFormat = 'yyyy-MM-dd';
  readonly reportColumns = [
    [
      'LOG_DATE_FROM',
      'LOG_DATE_TO',
      'LOG_CLIENT',
      'LOG_ISSUE_NAME',
      'LOG_PROJECT_HOURS',
      'LOG_INTERNAL_HOURS',
    ],
  ];
  formGroup = new FormGroup({
    user: new FormControl(ls.get('user') || ''),
  });

  updateLs$ = this.formGroup.valueChanges.pipe(
    tap((reportConfig: ReportConfig) => {
      Object.entries(reportConfig).forEach(([key, value]) => {
        ls.set(key, value);
      });
    })
  );

  subscription = new Subscription();

  constructor() {
    this.subscription.add(this.updateLs$.subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createReport(data: string[][]): void {
    const activeDate = new Date();
    const fileName = `${this.formGroup.get('user')?.value}_${format(
      activeDate,
      'yyyy_MM'
    )}.xlsx`;
    this.saveXlsxFile(data, fileName);
  }

  createMultiReport(entries: IReportEntry[]): string[][] {
    function date(x: string): Date {
      if (!x) return new Date();
      return toDate(parseISO(x));
    }
    function getEntryKey(entry: IReportEntry): string {
      return `${entry.client}..${entry.project}`;
    }
    let firstReportedDay!: string;
    let lastReportedDay!: string;
    let entriesGrouped: Record<
      string,
      {
        $entry: IReportEntry;
        projectDays: WorkingDay[];
        internalDays: WorkingDay[];
      }
    > = {};
    entries.forEach((entry) => {
      const entryKey = getEntryKey(entry);
      if (!entriesGrouped[entryKey]) {
        entriesGrouped[entryKey] = {
          $entry: entry,
          projectDays: [],
          internalDays: [],
        };
      }

      entry.selectedDays.forEach((selectedDay) => {
        entriesGrouped[entryKey][
          entry.isInternal ? 'internalDays' : 'projectDays'
        ].push({
          date: selectedDay,
          hours: entry.hours,
        });

        if (!firstReportedDay || !lastReportedDay) {
          firstReportedDay = selectedDay;
          lastReportedDay = selectedDay;
          return;
        }

        if (date(selectedDay) > date(lastReportedDay)) {
          lastReportedDay = selectedDay;
        }

        if (date(selectedDay) < date(firstReportedDay)) {
          firstReportedDay = selectedDay;
        }
      });
    });
    const firstDayFirstMonth = startOfMonth(date(firstReportedDay));
    const lastDayLastMonth = lastDayOfMonth(date(lastReportedDay));
    const intervals = eachWeekOfInterval(
      {
        start: firstDayFirstMonth,
        end: lastDayLastMonth,
      },
      {
        weekStartsOn: 1,
      }
    );
    intervals[0] = firstDayFirstMonth;
    const intervalsGrouped: Record<
      string,
      {
        [key: string]: {
          internalHours: number;
          projectHours: number;
        };
      }
    > = {};
    intervals.forEach((interval) => {
      function isWithinWeek(date: number | Date): boolean {
        return isWithinInterval(date, {
          start: interval,
          end: endOfWeek(interval, { weekStartsOn: 1 }),
        });
      }

      Object.keys(entriesGrouped).forEach((key) => {
        let week = intervalsGrouped[format(interval, this.dateFormat)];
        if (!week) {
          intervalsGrouped[format(interval, this.dateFormat)] = {};
          week = intervalsGrouped[format(interval, this.dateFormat)];
        }
        if (!week[key]) {
          week[key] = {
            internalHours: 0,
            projectHours: 0,
          };
        }
        const value = entriesGrouped[key];
        value.internalDays.forEach((internalDay) => {
          if (isWithinWeek(date(internalDay.date))) {
            week[key].internalHours += Number(internalDay.hours);
          }
        });

        value.projectDays.forEach((day) => {
          if (isWithinWeek(date(day.date))) {
            week[key].projectHours += Number(day.hours);
          }
        });
      });
    });

    const normalizedData = [...this.reportColumns];
    let internalSum = 0;
    let projectSum = 0;
    Object.keys(intervalsGrouped).forEach((key) => {
      const value = intervalsGrouped[key];
      Object.keys(value).forEach((projectKey) => {
        const projectValue = value[projectKey];
        if (projectValue.internalHours || projectValue.projectHours) {
          const _endOfWeek = endOfWeek(date(key), { weekStartsOn: 1 });
          internalSum += projectValue.internalHours;
          projectSum += projectValue.projectHours;
          normalizedData.push([
            key,
            format(
              isSameMonth(date(key), _endOfWeek)
                ? _endOfWeek
                : lastDayOfMonth(date(key)),
              this.dateFormat
            ),
            projectKey.split('..')[0],
            projectKey.split('..')[1],
            projectValue.projectHours.toString(),
            projectValue.internalHours.toString(),
          ]);
        }
      });
    });
    if (entries && entries.length) {
      normalizedData.push([]);
      normalizedData.push([]);
      normalizedData.push([
        '',
        '',
        '',
        '',
        projectSum.toString(),
        internalSum.toString(),
      ]);
    }

    return normalizedData;
  }

  saveXlsxFile(data: string[][], fileName: string): void {
    const sheetName = 'Sheet 1';

    const sheet = xlsx.utils.aoa_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, sheet, sheetName);
    xlsx.writeFile(wb, fileName);
  }

  protected getParsedData() {}
}
