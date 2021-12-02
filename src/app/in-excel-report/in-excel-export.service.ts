import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { addDays, eachDayOfInterval, eachWeekOfInterval, endOfMonth, format, getWeek, isWeekend, lastDayOfMonth, parseISO, startOfMonth, toDate } from 'date-fns';
import ls from 'localstorage-slim';
import { groupBy } from 'lodash';
import { Subscription, tap } from 'rxjs';
import * as xlsx from 'xlsx';
import { ReportConfig } from './in-excel-export.model';
@Injectable()
export class InExcelExportService {
  readonly dateFormat = 'yyyy-MM-dd';
  readonly reportColumns = [
    ["LOG_DATE_FROM", "LOG_DATE_TO", "LOG_CLIENT", "LOG_ISSUE_NAME", "LOG_PROJECT_HOURS", "LOG_INTERNAL_HOURS"],
  ];
    formGroup = new FormGroup({
      user: new FormControl(ls.get('user') || ''),
    });

    updateLs$ = this.formGroup.valueChanges.pipe(tap((reportConfig: ReportConfig) => {
      Object.entries(reportConfig).forEach(([key, value]) => {
        ls.set(key, value);
      })
    }))
    
    subscription = new Subscription();    
    
    constructor() {
      this.subscription.add(this.updateLs$.subscribe())
    }
  
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    createReport(selectedDays: string[], client?: string, project?: string, isInternal?: boolean): void {
      const activeDate = toDate(parseISO(selectedDays[0]) || Date.now());
      const fileName = `${this.formGroup.get('user')?.value}_${format(activeDate, 'yyyy_MM')}.xlsx`;    
      this.saveXlsxFile(this.calculateReport(selectedDays, client, project, isInternal), fileName);
    }

    calculateReport(selectedDays: string[], client?: string, project?: string, isInternal?: boolean): string[][] {
      if (!selectedDays || !selectedDays.length) {
        return [...this.reportColumns];
      }

      const ws_data = [...this.reportColumns];
      const activeDate = toDate(parseISO(selectedDays[0]) || Date.now())
      const firstDay = startOfMonth(activeDate);
      const lastDay = lastDayOfMonth(activeDate);
      const intervals = eachWeekOfInterval({
        start: startOfMonth(activeDate),
        end: endOfMonth(activeDate)
      }, {
        weekStartsOn: 1
      });
      const daysInWeek = groupBy(selectedDays.map((day) => parseISO(day)), getWeek)
      const sumProjectHours = selectedDays.length * 8;
      intervals.forEach((interval, index) => {
        const weekHours = ((daysInWeek[getWeek(interval)]?.length || 0) * 8).toString();
        
        ws_data.push([
          format(index === 0 ? firstDay : interval, this.dateFormat),
          format(index === intervals.length - 1 ? lastDay : addDays(interval, 6), this.dateFormat),
          client || '',
          project || 'Projekt',
          isInternal ? '0' : weekHours,
          isInternal ? weekHours : '0'
        ])
      })
      ws_data.push([]);
      ws_data.push([]);
      ws_data.push(['', '', '', '', sumProjectHours.toString()]);
      console.table(ws_data);
      
      return ws_data;
    }

    saveXlsxFile(data: string[][], fileName: string): void {
      const sheetName = "Sheet 1";
    
      const sheet = xlsx.utils.aoa_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, sheet, sheetName);
      xlsx.writeFile(wb, fileName);
    }
}
